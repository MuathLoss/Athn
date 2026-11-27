import uuid
from contextlib import closing
from database import connect, BASE

DATA = BASE / "Dataset"


def initialize_registration():
    with closing(connect()) as conn, conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS registered_embeddings (
                image_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                embedding BLOB NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (image_id)
                    REFERENCES registered_images(image_id)
            )
        """)


def save_registration(title, owner_id, owner_name,
                      png_bytes, embedding_bytes):

    if len(embedding_bytes) != 512 * 4:
        raise ValueError("Invalid embedding size")

    image_id = uuid.uuid4().hex
    registration_id = "ATHN-DEMO-" + image_id.upper()

    relative_path = f"Reference/registered/{image_id}.png"
    path = DATA / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)

    try:
        path.write_bytes(png_bytes)

        with closing(connect()) as conn, conn:
            conn.execute("""
                INSERT INTO registered_images
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                image_id,
                registration_id,
                owner_id,
                owner_name,
                relative_path,
                "active"
            ))

            conn.execute("""
                INSERT INTO registered_embeddings
                (image_id, title, embedding)
                VALUES (?, ?, ?)
            """, (
                image_id,
                title,
                embedding_bytes
            ))

    except Exception:
        path.unlink(missing_ok=True)
        raise

    return {
        "image_id": image_id,
        "registration_id": registration_id,
        "image_path": relative_path,
        "title": title,
        "owner_name": owner_name
    }


def load_registered_embeddings():
    with closing(connect()) as conn:
        return conn.execute("""
            SELECT image_id, embedding
            FROM registered_embeddings
            ORDER BY image_id
        """).fetchall()


if __name__ == "__main__":
    initialize_registration()
    print("Dynamic registration storage ready!")
    print("New registered photographs:",
          len(load_registered_embeddings()))
