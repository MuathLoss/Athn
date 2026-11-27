import os
import secrets
import hashlib
import time

from contextlib import closing
from fastapi import APIRouter, Request, Response, HTTPException
from pydantic import BaseModel
from database import connect

router = APIRouter(prefix="/portal")

COOKIE = "athn_session"
SESSION_DURATION = 86400

ACCOUNTS = {
    "seller@example.test": {
        "password": os.environ.get("ATHN_SELLER_A_PASSWORD", ""),
        "id": "seller_a",
        "name": "البائع أ",
        "role": "seller"
    },
    "seller_b@example.test": {
        "password": os.environ.get("ATHN_SELLER_B_PASSWORD", ""),
        "id": "seller_b",
        "name": "البائع ب",
        "role": "seller"
    },
    "owner@example.test": {
        "password": os.environ.get("ATHN_OWNER_PASSWORD", ""),
        "id": "owner_demo",
        "name": "صاحب الحق التجريبي",
        "role": "rights_holder"
    },
    "reviewer@example.test": {
        "password": os.environ.get("ATHN_REVIEWER_PASSWORD", ""),
        "id": "usr_rev_001",
        "name": "ريم الحربي",
        "role": "reviewer"
    }
}


class Credentials(BaseModel):
    identifier: str
    password: str


def initialize_auth():
    with closing(connect()) as conn, conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                expires_at INTEGER NOT NULL
            )
        """)


def hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()


def public_user(account):
    return {
        "id": account["id"],
        "name": account["name"],
        "role": account["role"]
    }


def current_user(request):
    token = request.cookies.get(COOKIE)

    if not token:
        return None

    with closing(connect()) as conn:
        row = conn.execute("""
            SELECT user_id FROM sessions
            WHERE token_hash = ?
            AND expires_at > ?
        """, (
            hash_token(token),
            int(time.time())
        )).fetchone()

    if not row:
        return None

    for account in ACCOUNTS.values():
        if account["id"] == row["user_id"]:
            return public_user(account)

    return None


def require_user(request, role=None):
    user = current_user(request)

    if not user:
        raise HTTPException(401, "Login required")

    if role and user["role"] != role:
        raise HTTPException(403, "Access denied")

    return user


@router.get("/session")
def session(request: Request):
    return current_user(request)


@router.post("/sign-in")
def sign_in(
    credentials: Credentials,
    request: Request,
    response: Response
):
    account = ACCOUNTS.get(
        credentials.identifier.strip().lower()
    )

    if not account or not account["password"] or not secrets.compare_digest(
        account["password"].encode(),
        credentials.password.encode()
    ):
        raise HTTPException(401, "Invalid credentials")

    token = secrets.token_urlsafe(32)
    old_token = request.cookies.get(COOKIE)

    with closing(connect()) as conn, conn:

        conn.execute(
            "DELETE FROM sessions WHERE expires_at <= ?",
            (int(time.time()),)
        )

        if old_token:
            conn.execute(
                "DELETE FROM sessions WHERE token_hash = ?",
                (hash_token(old_token),)
            )

        conn.execute(
            "INSERT INTO sessions VALUES (?, ?, ?)",
            (
                hash_token(token),
                account["id"],
                int(time.time()) + SESSION_DURATION
            )
        )

    response.set_cookie(
        key=COOKIE,
        value=token,
        httponly=True,
        samesite="lax",
        secure=os.environ.get("ATHN_SECURE_COOKIE", "false").lower() == "true",
        max_age=SESSION_DURATION
    )

    return public_user(account)


@router.post("/sign-out")
def sign_out(
    request: Request,
    response: Response
):
    token = request.cookies.get(COOKIE)

    if token:
        with closing(connect()) as conn, conn:
            conn.execute(
                "DELETE FROM sessions WHERE token_hash = ?",
                (hash_token(token),)
            )

    response.delete_cookie(COOKIE, httponly=True, samesite="lax", secure=os.environ.get("ATHN_SECURE_COOKIE", "false").lower() == "true")

    return {"status": "signed_out"}


if __name__ == "__main__":
    initialize_auth()
    print("Authentication database ready!")
    print("Demo accounts:", len(ACCOUNTS))
