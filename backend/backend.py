import json
import cv2
import torch
import numpy as np
import torch.nn.functional as F

from database import connect, initialize, BASE
from config import ALLOWED_ORIGINS
from portal_auth import require_user
from registration import (
    initialize_registration,
    save_registration,
    load_registered_embeddings
)

from contextlib import closing
from io import BytesIO
from PIL import Image
from torchvision import transforms
from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

DATA = BASE / "Dataset"

device = "cuda" if torch.cuda.is_available() else "cpu"

initialize()
initialize_registration()

# Load AI model
model = torch.jit.load(
    str(BASE / "Models/sscd_disc_mixup.torchscript.pt"),
    map_location=device
).eval()

saved = torch.load(
    BASE / "Embeddings/reference_embeddings.pt",
    map_location=device,
    weights_only=True
)

database = saved["embeddings"]
image_ids = list(saved["image_ids"])

config = json.loads(
    (BASE / "MetaData/detection_config.json").read_text()
)

preprocess = transforms.Compose([
    transforms.Resize((320, 320)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])


# Generate image embedding
@torch.inference_mode()
def generate_embedding(img):
    x = preprocess(img).unsqueeze(0).to(device)
    return F.normalize(model(x), dim=1)


# Combine original and newly registered embeddings
def get_index():
    records = load_registered_embeddings()

    if not records:
        return database, image_ids

    vectors = np.stack([
        np.frombuffer(r["embedding"], dtype=np.float32)
        for r in records
    ])

    new_vectors = torch.from_numpy(vectors).to(device)

    combined = torch.cat(
        [database, new_vectors], dim=0
    )

    combined_ids = image_ids + [
        r["image_id"] for r in records
    ]

    return combined, combined_ids


# Retrieve ownership and permissions
def get_record(image_id):
    with closing(connect()) as conn:
        row = conn.execute(
            "SELECT * FROM registered_images WHERE image_id = ?",
            (image_id,)
        ).fetchone()

        if row is None:
            raise HTTPException(500, "Registry record missing")

        record = dict(row)

        permissions = conn.execute(
            "SELECT seller_id FROM permissions WHERE image_id = ?",
            (image_id,)
        ).fetchall()

        record["authorized_sellers"] = [
            p["seller_id"] for p in permissions
        ]

        return record


# Validate uploaded image
def read_image(image):
    content = image.file.read(10 * 1024 * 1024 + 1)

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "Image too large")

    try:
        img = Image.open(BytesIO(content))

        if img.width * img.height > 20000000:
            raise HTTPException(413, "Image resolution too large")

        img = img.convert("RGB")

        gray = cv2.imdecode(
            np.frombuffer(content, dtype=np.uint8), 0
        )

        if gray is None:
            raise ValueError("Invalid image")

        return img, gray

    except (
        OSError,
        ValueError,
        cv2.error,
        Image.DecompressionBombError
    ):
        raise HTTPException(400, "Invalid image")


# Geometric verification
def verify_regions(query, path):
    sift = cv2.SIFT_create()
    matcher = cv2.BFMatcher()

    ref = cv2.imdecode(
        np.frombuffer(path.read_bytes(), dtype=np.uint8), 0
    )

    if ref is None:
        return 0, 0

    k1, d1 = sift.detectAndCompute(query, None)
    k2, d2 = sift.detectAndCompute(ref, None)

    if d1 is None or d2 is None or len(d2) < 2:
        return 0, 0

    matches = [
        pair[0]
        for pair in matcher.knnMatch(d1, d2, k=2)
        if len(pair) == 2
        and pair[0].distance < 0.75 * pair[1].distance
    ]

    if len(matches) < 4:
        return 0, 0

    src = np.float32([
        k1[m.queryIdx].pt for m in matches
    ])

    dst = np.float32([
        k2[m.trainIdx].pt for m in matches
    ])

    _, mask = cv2.findHomography(
        src, dst, cv2.RANSAC, 3.0
    )

    count = int(mask.sum()) if mask is not None else 0

    return count, count / len(matches)


# AI detection engine
@torch.inference_mode()
def detect(img, gray):
    embedding = generate_embedding(img)

    vectors, ids = get_index()

    scores, indices = (embedding @ vectors.T).topk(
        min(config["top_k"], len(ids))
    )

    scores = scores[0].tolist()
    indices = indices[0].tolist()

    rank = 0
    risk = "low"

    if scores[0] >= config["high_similarity_threshold"]:
        risk = "high"

    elif scores[0] >= config["review_threshold"]:
        risk = "medium"

        for r, score in enumerate(scores):

            if score < config["geometric_similarity_threshold"]:
                break

            record = get_record(ids[indices[r]])

            n, ratio = verify_regions(
                gray, DATA / record["image_path"]
            )

            if (
                n >= config["min_inliers"]
                and ratio >= config["min_inlier_ratio"]
            ):
                rank = r
                risk = "high"
                break

    return ids[indices[rank]], scores[rank], risk


# FastAPI
app = FastAPI(title="ATHN API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Reject cross-origin state changes outside the explicitly configured frontend.
@app.middleware("http")
async def check_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if (request.method not in {"GET", "HEAD", "OPTIONS"}
            and origin and origin.rstrip("/") not in ALLOWED_ORIGINS):
        return JSONResponse({"detail": "Origin not allowed"}, status_code=403)
    return await call_next(request)


# Restrict reference images to the rights holder, reviewer or involved seller.
@app.get("/images/{path:path}", name="images")
def reference_image(path: str, request: Request):
    user = require_user(request)
    reference_root = (DATA / "Reference").resolve()
    target = (reference_root / path).resolve()
    if not target.is_relative_to(reference_root) or not target.is_file():
        raise HTTPException(404, "Image not found")
    relative = "Reference/" + target.relative_to(reference_root).as_posix()

    with closing(connect()) as conn:
        work = conn.execute(
            "SELECT image_id, owner_id FROM registered_images WHERE image_path = ?",
            (relative,)
        ).fetchone()
        if not work:
            raise HTTPException(404, "Image not found")
        allowed = user["role"] == "reviewer" or (
            user["role"] == "rights_holder" and user["id"] == work["owner_id"]
        )
        if user["role"] == "seller":
            allowed = conn.execute(
                "SELECT 1 FROM verifications WHERE work_id = ? AND seller_id = ? LIMIT 1",
                (work["image_id"], user["id"])
            ).fetchone() is not None
        if not allowed:
            raise HTTPException(403, "Access denied")
    return FileResponse(target, headers={"Cache-Control": "private, no-store"})


# System health
@app.get("/health")
def health():
    new_count = len(load_registered_embeddings())

    return {
        "status": "online",
        "device": device,
        "registered_images": len(image_ids) + new_count,
        "original_images": len(image_ids),
        "new_registrations": new_count
    }


# Register a new photograph
@app.post("/register")
def register(
    request: Request,
    image: UploadFile = File(...),
    title: str = Form(...)
):
    user = require_user(request, "rights_holder")

    title = title.strip()

    if not title or len(title) > 200:
        raise HTTPException(400, "Invalid title")

    img, gray = read_image(image)

    embedding = generate_embedding(img)

    embedding_bytes = (
        embedding.squeeze(0)
        .cpu()
        .numpy()
        .astype(np.float32)
        .tobytes()
    )

    buffer = BytesIO()
    img.save(buffer, format="PNG")

    record = save_registration(
        title=title,
        owner_id=user["id"],
        owner_name=user["name"],
        png_bytes=buffer.getvalue(),
        embedding_bytes=embedding_bytes
    )

    record["matched_image_url"] = str(
        request.url_for(
            "images",
            path=record["image_path"].removeprefix("Reference/")
        )
    )

    record["status"] = "registered"
    record["registry_source"] = "ATHN Demo"

    return record

# Analyze seller photograph
@app.post("/analyze")
def analyze(
    request: Request,
    image: UploadFile = File(...)
):
    user = require_user(request, "seller")
    seller_id = user["id"]

    img, gray = read_image(image)

    matched_id, score, risk = detect(img, gray)

    record = get_record(matched_id) if risk != "low" else {}

    authorization = "not_applicable"
    decision = "allow"

    if risk == "medium":
        authorization = "unknown"
        decision = "review"

    elif risk == "high":

        authorized = seller_id in record["authorized_sellers"]

        authorization = (
            "authorized" if authorized else "not_recorded"
        )

        decision = (
            "allow" if authorized else "hold_for_review"
        )

    path = record.get("image_path")

    result = {
        "similarity_score": round(score, 4),
        "match_found": risk == "high",
        "matched_id": record.get("image_id"),
        "matched_image_path": path,
        "matched_image_url": str(request.url_for(
            "images", path=path.removeprefix("Reference/")
        )) if path else None,
        "registration_id": record.get("registration_id"),
        "registered_owner": record.get("owner_name"),
        "authorization_status": authorization,
        "risk_level": risk,
        "decision": decision,
        "notify_owner": decision == "hold_for_review"
    }

    return record_verification(request, user, img, result)


# Authentication integration
from portal_auth import router as auth_router
from portal_auth import initialize_auth

initialize_auth()
app.include_router(auth_router)
# Rights-holder integration
from portal_rights import router as rights_router

app.include_router(rights_router)

# Verification and review integration
from portal_events import (
    router as events_router,
    initialize_events,
    record_verification
)

initialize_events()
app.include_router(events_router)
