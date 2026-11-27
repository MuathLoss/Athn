import sqlite3
import json
from contextlib import closing
from config import RUNTIME_DIR

BASE = RUNTIME_DIR
DB = BASE / "athn.db"

def connect():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def initialize():
    with closing(connect()) as conn, conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS registered_images (
                image_id TEXT PRIMARY KEY,
                registration_id TEXT UNIQUE,
                owner_id TEXT,
                owner_name TEXT,
                image_path TEXT,
                status TEXT DEFAULT 'active'
            );

            CREATE TABLE IF NOT EXISTS permissions (
                image_id TEXT,
                seller_id TEXT,
                PRIMARY KEY (image_id, seller_id),
                FOREIGN KEY (image_id)
                    REFERENCES registered_images(image_id)
            );

            CREATE TABLE IF NOT EXISTS app_meta (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        """)

        seeded = conn.execute(
            "SELECT value FROM app_meta WHERE key = 'seeded'"
        ).fetchone()

        if not seeded:
            records = json.loads(
                (BASE / "MetaData/registry.json")
                .read_text(encoding="utf-8")
            )

            for r in records:
                conn.execute("""
                    INSERT INTO registered_images
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (
                    r["image_id"],
                    r["registration_id"],
                    r.get("owner_id", "owner_demo"),
                    r["owner_name"],
                    r["image_path"],
                    r.get("status", "active")
                ))

                for seller in r["authorized_sellers"]:
                    conn.execute(
                        "INSERT INTO permissions VALUES (?, ?)",
                        (r["image_id"], seller)
                    )

            conn.execute(
                "INSERT INTO app_meta VALUES ('seeded', 'yes')"
            )

        images = conn.execute(
            "SELECT COUNT(*) FROM registered_images"
        ).fetchone()[0]

        permissions = conn.execute(
            "SELECT COUNT(*) FROM permissions"
        ).fetchone()[0]

        print("Database ready!")
        print("Registered images:", images)
        print("Permissions:", permissions)

if __name__ == "__main__":
    initialize()
