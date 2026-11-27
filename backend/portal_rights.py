from portal_events import get_activity, get_notices
from contextlib import closing
from fastapi import APIRouter, Request, HTTPException

from database import connect
from portal_auth import require_user

router = APIRouter(prefix="/portal")


def format_work(request, row):
    return {
        "id": row["image_id"],
        "registration_id": row["registration_id"],
        "title": row["title"] or row["registration_id"],
        "image_url": str(request.url_for(
            "images",
            path=row["image_path"].removeprefix("Reference/")
        )),
        "owner_name": row["owner_name"],
        "registry_source": (
            "ATHN Demo" if row["title"]
            else "Simulated SAIP"
        ),
        "registration_status": row["status"],
        "registered_at": (
            row["created_at"].replace(" ", "T") + "Z"
            if row["created_at"] else None
        ),
        "authorization_count": row["permission_count"],
        "recent_activity_count": row["activity_count"],
        "last_activity_at": row["last_activity"]
    }


def get_works(request, owner_id):
    with closing(connect()) as conn:
        rows = conn.execute("""
            SELECT r.*, e.title, e.created_at,
            (
                SELECT COUNT(*) FROM permissions p
                WHERE p.image_id = r.image_id
            ) AS permission_count,
            (
                SELECT COUNT(*) FROM verifications v
                WHERE v.work_id = r.image_id
            ) AS activity_count,
            (
                SELECT MAX(created_at) FROM verifications v
                WHERE v.work_id = r.image_id
            ) AS last_activity
            FROM registered_images r
            LEFT JOIN registered_embeddings e
                ON r.image_id = e.image_id
            WHERE r.owner_id = ?
            ORDER BY e.created_at DESC, r.registration_id
        """, (owner_id,)).fetchall()

    return [format_work(request, r) for r in rows]


@router.get("/works")
def works(
    request: Request,
    query: str = "",
    status: str = ""
):
    user = require_user(request, "rights_holder")

    items = get_works(request, user["id"])
    query = query.strip().lower()

    return [
        item for item in items
        if query in (
            item["title"] + " " + item["registration_id"]
        ).lower()
        and (
            not status
            or item["registration_status"] == status
        )
    ]


@router.get("/works/{work_id}")
def work_detail(work_id: str, request: Request):
    user = require_user(request, "rights_holder")

    items = get_works(request, user["id"])

    item = next(
        (w for w in items if w["id"] == work_id),
        None
    )

    if not item:
        raise HTTPException(404, "Work not found")

    with closing(connect()) as conn:
        permissions = conn.execute("""
            SELECT seller_id FROM permissions
            WHERE image_id = ?
        """, (work_id,)).fetchall()

    item["authorizations"] = [
        {
            "id": work_id + "_" + p["seller_id"],
            "seller_id": p["seller_id"],
            "seller_name": p["seller_id"],
            "marketplace": "سوق المتاجر",
            "status": "authorized"
        }
        for p in permissions
    ]

    item["recent_verifications"] = get_activity(
        request, user["id"], work_id
    )

    return item



@router.get("/overview")
def overview(request: Request):
    user = require_user(request, "rights_holder")

    items = get_works(request, user["id"])
    events = get_activity(request, user["id"])
    notices = get_notices(request, user["id"])

    priority = [
        item for item in events
        if item["review_status"] in ["pending", "in_review"]
    ][:3]

    recent = priority + [
        item for item in events[:10]
        if item["id"] not in {
            p["id"] for p in priority
        }
    ]

    return {
        "protected_work_count": len(items),
        "unread_notification_count": sum(
            not item["read"] for item in notices
        ),
        "priority_items": [
            {
                "type": "verification",
                "id": item["id"],
                "title": "محاولة استخدام تحتاج مراجعة"
            }
            for item in priority
        ],
        "recent_works": items[:5],
        "recent_verifications": recent,
        "registry_status": "connected"
    }


@router.get("/activity")
def activity(
    request: Request,
    query: str = "",
    decision: str = "",
    review_status: str = "",
    work_id: str = ""
):
    user = require_user(request, "rights_holder")

    return get_activity(
        request,
        user["id"],
        work_id=work_id,
        query=query,
        decision=decision,
        review_status=review_status
    )


# Seller permission management
from portal_auth import ACCOUNTS


def check_permission_access(conn, request, work_id, seller_id):
    user = require_user(request, "rights_holder")

    work = conn.execute("""
        SELECT image_id FROM registered_images
        WHERE image_id = ? AND owner_id = ?
    """, (work_id, user["id"])).fetchone()

    if not work:
        raise HTTPException(404, "Work not found")

    valid_sellers = {
        account["id"]
        for account in ACCOUNTS.values()
        if account["role"] == "seller"
    }

    if seller_id not in valid_sellers:
        raise HTTPException(400, "Invalid seller")


@router.put("/works/{work_id}/permissions/{seller_id}")
def grant_permission(
    work_id: str,
    seller_id: str,
    request: Request
):
    with closing(connect()) as conn, conn:
        check_permission_access(
            conn, request, work_id, seller_id
        )

        conn.execute("""
            INSERT OR IGNORE INTO permissions
            (image_id, seller_id)
            VALUES (?, ?)
        """, (work_id, seller_id))

    return {
        "status": "authorized",
        "image_id": work_id,
        "seller_id": seller_id
    }


@router.delete("/works/{work_id}/permissions/{seller_id}")
def revoke_permission(
    work_id: str,
    seller_id: str,
    request: Request
):
    with closing(connect()) as conn, conn:
        check_permission_access(
            conn, request, work_id, seller_id
        )

        conn.execute("""
            DELETE FROM permissions
            WHERE image_id = ? AND seller_id = ?
        """, (work_id, seller_id))

    return {
        "status": "not_recorded",
        "image_id": work_id,
        "seller_id": seller_id
    }
