import json
import uuid

from datetime import datetime, timezone
from contextlib import closing
from typing import Literal

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from database import connect, BASE
from portal_auth import require_user, current_user

router = APIRouter(prefix="/portal")

EVIDENCE = BASE / "Evidence"
EVIDENCE.mkdir(exist_ok=True)


def now():
    return datetime.now(timezone.utc).isoformat()


def uid(prefix):
    return prefix + "_" + uuid.uuid4().hex


def initialize_events():
    with closing(connect()) as conn, conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS verifications (
                id TEXT PRIMARY KEY,
                owner_id TEXT,
                work_id TEXT,
                seller_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS review_cases (
                id TEXT PRIMARY KEY,
                verification_id TEXT UNIQUE NOT NULL,
                reason TEXT NOT NULL,
                status TEXT NOT NULL,
                revision INTEGER DEFAULT 0,
                human_decision TEXT,
                human_note TEXT,
                audit_id TEXT,
                FOREIGN KEY (verification_id)
                    REFERENCES verifications(id)
            );

            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                owner_id TEXT NOT NULL,
                verification_id TEXT NOT NULL,
                work_id TEXT,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL,
                read INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS review_audit (
                id TEXT PRIMARY KEY,
                case_id TEXT NOT NULL,
                reviewer_id TEXT NOT NULL,
                decision TEXT NOT NULL,
                note TEXT,
                created_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS verification_owner
                ON verifications(owner_id);

            CREATE INDEX IF NOT EXISTS verification_work
                ON verifications(work_id);
        """)


def add_notice(conn, owner_id, verification_id,
               work_id, kind, title, message):

    if owner_id:
        conn.execute("""
            INSERT INTO notifications
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
        """, (
            uid("not"), owner_id, verification_id,
            work_id, kind, title, message, now()
        ))


def record_verification(request, user, img, result):
    verification_id = uid("ver")
    work_id = result.get("matched_id")
    created_at = now()

    path = EVIDENCE / (verification_id + ".jpg")
    img.save(path, format="JPEG", quality=90)

    try:
        with closing(connect()) as conn, conn:
            work = conn.execute("""
                SELECT owner_id
                FROM registered_images
                WHERE image_id = ?
            """, (work_id,)).fetchone()

            owner_id = work["owner_id"] if work else None

            payload = dict(result)
            payload.pop("matched_image_url", None)
            payload["seller_name"] = user["name"]

            conn.execute("""
                INSERT INTO verifications
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                verification_id, owner_id, work_id,
                user["id"], created_at,
                json.dumps(payload, ensure_ascii=False)
            ))

            if result["decision"] != "allow":
                reason = (
                    "borderline_match"
                    if result["risk_level"] == "medium"
                    else "unknown_authorization"
                )

                conn.execute("""
                    INSERT INTO review_cases
                    (id, verification_id, reason, status)
                    VALUES (?, ?, ?, 'pending')
                """, (
                    uid("case"), verification_id, reason
                ))

            if result["notify_owner"]:
                add_notice(
                    conn, owner_id, verification_id,
                    work_id, "unauthorized_usage",
                    "محاولة استخدام تحتاج مراجعة",
                    "تم رصد تشابه بصري دون إذن مسجل للبائع."
                )

    except Exception:
        path.unlink(missing_ok=True)
        raise

    result["verification_id"] = verification_id

    return result


def verification_data(request, conn, row):
    payload = json.loads(row["payload"])

    case = conn.execute("""
        SELECT status FROM review_cases
        WHERE verification_id = ?
    """, (row["id"],)).fetchone()

    path = payload.get("matched_image_path")

    matched_url = str(request.url_for(
        "images",
        path=path.removeprefix("Reference/")
    )) if path else None

    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "marketplace": {
            "id": "market_01",
            "name": "سوق المتاجر"
        },
        "seller": {
            "id": row["seller_id"],
            "display_name": payload["seller_name"]
        },
        "uploaded_image_url": str(request.url_for(
            "verification_image",
            verification_id=row["id"]
        )),
        "matched_image_url": matched_url,
        "match_found": payload["match_found"],
        "similarity_score": payload["similarity_score"],
        "registration_id": payload.get("registration_id"),
        "registered_owner": payload.get("registered_owner"),
        "authorization_status": payload["authorization_status"],
        "decision": payload["decision"],
        "review_status": (
            case["status"] if case else "not_required"
        ),
        "notification_status": (
            "sent" if payload["notify_owner"]
            and row["owner_id"] else "not_required"
        ),
        "evidence_availability": (
            "full" if matched_url else "partial"
        )
    }


def get_activity(request, owner_id, work_id="",
                 query="", decision="", review_status=""):

    with closing(connect()) as conn:
        rows = conn.execute("""
            SELECT * FROM verifications
            WHERE owner_id = ?
            AND (? = '' OR work_id = ?)
            ORDER BY created_at DESC
        """, (
            owner_id, work_id, work_id
        )).fetchall()

        items = [
            verification_data(request, conn, row)
            for row in rows
        ]

    query = query.strip().lower()

    return [
        item for item in items
        if query in (
            item["id"] + " " +
            item["marketplace"]["name"] + " " +
            item["seller"]["id"] + " " +
            (item["registration_id"] or "")
        ).lower()
        and (not decision or item["decision"] == decision)
        and (
            not review_status
            or item["review_status"] == review_status
        )
    ]


def get_notices(request, owner_id):
    with closing(connect()) as conn:
        rows = conn.execute("""
            SELECT * FROM notifications
            WHERE owner_id = ?
            ORDER BY created_at DESC
        """, (owner_id,)).fetchall()

    items = []

    for row in rows:
        item = dict(row)
        item.pop("owner_id")
        item["read"] = bool(item["read"])
        item["preview_image_url"] = str(request.url_for(
            "verification_image",
            verification_id=item["verification_id"]
        ))
        items.append(item)

    return items


def check_verification(conn, request, verification_id):
    user = require_user(request)

    row = conn.execute("""
        SELECT * FROM verifications WHERE id = ?
    """, (verification_id,)).fetchone()

    if not row:
        raise HTTPException(404, "Verification not found")

    allowed = (
        user["role"] == "reviewer"
        or (
            user["role"] == "rights_holder"
            and user["id"] == row["owner_id"]
        )
        or (
            user["role"] == "seller"
            and user["id"] == row["seller_id"]
        )
    )

    if not allowed:
        raise HTTPException(403, "Access denied")

    return row


def verification_detail(request, conn, row):
    item = verification_data(request, conn, row)

    steps = [
        ("request", "استلام الصورة", "marketplace"),
        ("visual", "التحقق البصري", "ai")
    ]

    if row["work_id"]:
        steps.extend([
            ("registry", "البحث في سجل الحقوق", "registry"),
            ("permission", "التحقق من الإذن", "authorization")
        ])

    steps.append(("decision", "نتيجة النظام", "system"))

    item["trace"] = [
        {
            "id": step[0],
            "label": step[1],
            "source": step[2],
            "status": "complete",
            "timestamp": row["created_at"]
        }
        for step in steps
    ]

    status = item["review_status"]

    if status != "not_required":
        item["trace"].append({
            "id": "review",
            "label": "المراجعة البشرية",
            "source": "reviewer",
            "status": (
                "complete" if status == "resolved"
                else "active" if status == "in_review"
                else "pending"
            )
        })

    item["related_work"] = None

    return item


@router.get("/marketplace-session")
def marketplace_session(request: Request):
    user = current_user(request)

    return {
        "authenticated": bool(
            user and user["role"] == "seller"
        )
    }


@router.get("/verification-image/{verification_id}")
def verification_image(
    verification_id: str, request: Request
):
    with closing(connect()) as conn:
        check_verification(conn, request, verification_id)

    path = EVIDENCE / (verification_id + ".jpg")

    if not path.is_file():
        raise HTTPException(404, "Image missing")

    return FileResponse(
        path,
        media_type="image/jpeg",
        headers={"Cache-Control": "private, no-store"}
    )


@router.get("/verifications/{verification_id}")
def verification(verification_id: str, request: Request):
    with closing(connect()) as conn:
        row = check_verification(
            conn, request, verification_id
        )
        return verification_detail(request, conn, row)


@router.get("/notifications")
def notifications(request: Request):
    user = require_user(request, "rights_holder")
    return get_notices(request, user["id"])


@router.post("/notifications/{notification_id}/read")
def mark_read(notification_id: str, request: Request):
    user = require_user(request, "rights_holder")

    with closing(connect()) as conn, conn:
        cursor = conn.execute("""
            UPDATE notifications SET read = 1
            WHERE id = ? AND owner_id = ?
        """, (notification_id, user["id"]))

        if not cursor.rowcount:
            raise HTTPException(404, "Notification not found")

    return {"status": "read"}


def case_data(request, conn, case):
    row = conn.execute("""
        SELECT * FROM verifications WHERE id = ?
    """, (case["verification_id"],)).fetchone()

    item = verification_detail(request, conn, row)

    permissions = conn.execute("""
        SELECT seller_id FROM permissions
        WHERE image_id = ?
    """, (row["work_id"],)).fetchall()

    return {
        "id": case["id"],
        "verification_id": row["id"],
        "created_at": row["created_at"],
        "reason": case["reason"],
        "status": case["status"],
        "verification": item,
        "verification_detail": item,
        "authorization_records": [
            {
                "id": row["work_id"] + "_" + p["seller_id"],
                "seller_id": p["seller_id"],
                "status": "authorized"
            }
            for p in permissions
        ],
        "revision": case["revision"],
        "available_decisions": (
            [] if case["status"] == "resolved"
            else [
                "confirm_allow",
                "confirm_hold",
                "needs_more_information"
            ]
        ),
        "humanDecision": case["human_decision"],
        "humanNote": case["human_note"],
        "auditId": case["audit_id"]
    }


def find_case(conn, case_id):
    case = conn.execute("""
        SELECT * FROM review_cases WHERE id = ?
    """, (case_id,)).fetchone()

    if not case:
        raise HTTPException(404, "Case not found")

    return case


@router.get("/review/queue")
def review_queue(
    request: Request,
    query: str = "",
    status: str = "",
    reason: str = ""
):
    require_user(request, "reviewer")

    with closing(connect()) as conn:
        rows = conn.execute("""
            SELECT * FROM review_cases
            ORDER BY rowid DESC
        """).fetchall()

        items = [
            case_data(request, conn, row)
            for row in rows
            if (not status or row["status"] == status)
            and (not reason or row["reason"] == reason)
        ]

    query = query.strip().lower()

    return [
        item for item in items
        if query in (
            item["id"] + " " +
            item["verification_id"] + " " +
            item["verification"]["marketplace"]["name"]
        ).lower()
    ]


@router.get("/review/cases/{case_id}")
def review_case(case_id: str, request: Request):
    require_user(request, "reviewer")

    with closing(connect()) as conn:
        return case_data(
            request, conn, find_case(conn, case_id)
        )


class ReviewInput(BaseModel):
    decision: Literal[
        "confirm_allow",
        "confirm_hold",
        "needs_more_information"
    ]
    note: str | None = Field(default=None, max_length=5000)


class ReviewSubmit(ReviewInput):
    expectedRevision: int = Field(ge=0)


@router.post("/review/cases/{case_id}/prepare")
def prepare_decision(
    case_id: str, data: ReviewInput, request: Request
):
    require_user(request, "reviewer")

    with closing(connect()) as conn:
        case = find_case(conn, case_id)

        if case["status"] == "resolved":
            raise HTTPException(409, "Case already resolved")

    messages = {
        "confirm_allow": "سيتم تسجيل قرار السماح.",
        "confirm_hold": "سيتم تسجيل قرار تعليق النشر.",
        "needs_more_information": "ستبقى الحالة قيد المراجعة."
    }

    return {
        "case_id": case_id,
        "decision": data.decision,
        "effect_summary": messages[data.decision]
    }


@router.post("/review/cases/{case_id}/submit")
def submit_decision(
    case_id: str, data: ReviewSubmit, request: Request
):
    user = require_user(request, "reviewer")

    with closing(connect()) as conn, conn:
        conn.execute("BEGIN IMMEDIATE")

        case = find_case(conn, case_id)

        if (
            case["status"] == "resolved"
            or case["revision"] != data.expectedRevision
        ):
            raise HTTPException(409, "Case changed")

        status = (
            "in_review"
            if data.decision == "needs_more_information"
            else "resolved"
        )

        audit_id = uid("audit")

        conn.execute("""
            UPDATE review_cases
            SET status = ?,
                revision = revision + 1,
                human_decision = ?,
                human_note = ?,
                audit_id = ?
            WHERE id = ?
        """, (
            status, data.decision,
            data.note, audit_id, case_id
        ))

        conn.execute("""
            INSERT INTO review_audit
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            audit_id, case_id, user["id"],
            data.decision, data.note, now()
        ))

        row = conn.execute("""
            SELECT * FROM verifications WHERE id = ?
        """, (case["verification_id"],)).fetchone()

        add_notice(
            conn, row["owner_id"], row["id"],
            row["work_id"],
            "review_resolved" if status == "resolved"
            else "review_started",
            "اكتمال المراجعة" if status == "resolved"
            else "الحالة قيد المراجعة",
            {
                "confirm_allow": "تم تسجيل قرار السماح.",
                "confirm_hold": "تم تسجيل قرار تعليق النشر.",
                "needs_more_information": "تحتاج الحالة إلى معلومات إضافية."
            }[data.decision]
        )

    return {
        "case_id": case_id,
        "status": status,
        "audit_id": audit_id
    }


if __name__ == "__main__":
    initialize_events()
    print("Verification storage ready!")
    print("Notifications ready!")
    print("Review cases and audit storage ready!")
