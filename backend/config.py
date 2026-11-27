"""Runtime configuration. Secrets are supplied by the environment, never Git."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RUNTIME_DIR = Path(os.getenv("ATHN_RUNTIME_DIR") or ROOT / "ATHN_runtime").expanduser().resolve()
ALLOWED_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "ATHN_ALLOWED_ORIGINS",
        "http://127.0.0.1:5173,http://localhost:5173"
    ).split(",")
    if origin.strip()
]
COOKIE_SECURE = os.getenv("ATHN_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
