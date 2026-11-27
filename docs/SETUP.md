# Local setup and recovery

Run from a clean clone. The application uses Python 3.11 and the frontend's locked npm dependencies (Node 24 was used for the original frontend; use a compatible current Node release).

## 1. Restore runtime assets

Obtain the assets from the authorized [ATHN Drive folder](https://drive.google.com/drive/folders/1LRAvdL-bINHn_J3GLlWBMCYhTVNmJtwE).

```text
ATHN_runtime/
├── Dataset/
│   └── Reference/        # 5,000 original reference photos, original subfolders
├── Embeddings/
│   └── reference_embeddings.pt
├── MetaData/
│   ├── registry.json
│   └── detection_config.json
└── Models/
    └── sscd_disc_mixup.torchscript.pt
```

Only these runtime assets are required for fresh inference. Preserve the relative image paths exactly. The original research-only image categories, query embeddings, notebook and evaluation artifacts are optional for running the app. Do not use the private `athn.db`, `Evidence/` or `Dataset/Reference/registered/` from a live instance for a new public demo. A fresh database is seeded automatically from the simulated registry. Use trusted model and embedding files only.

For private disaster recovery, stop the server, restore the matching private database and its registered image/evidence files together, and keep credentials and data private.

## 2. Backend

Windows PowerShell from the repository root:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
# CPU inference:
.\.venv\Scripts\python.exe -m pip install torch==2.9.1 torchvision==0.24.1 --index-url https://download.pytorch.org/whl/cpu
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.txt
Copy-Item backend/.env.example backend/.env
notepad backend/.env
```

For the NVIDIA CUDA 12.8 environment used in local testing, replace the CPU wheel installation with:

```powershell
.\.venv\Scripts\python.exe -m pip install torch==2.9.1 torchvision==0.24.1 --index-url https://download.pytorch.org/whl/cu128
```

Set four distinct passwords in `backend/.env`. Do not reuse the public mock fixture passwords. On Linux/macOS use `python3.11 -m venv .venv` and `.venv/bin/python`; select compatible PyTorch wheels for the host.

Start the backend from the root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend:app --app-dir backend --env-file backend/.env --host 127.0.0.1 --port 8000
```

Visit `http://127.0.0.1:8000/health` and `http://127.0.0.1:8000/docs`. A fresh runtime should report 5,000 indexed images. The service chooses CUDA when available, otherwise CPU. SQLite is created under the runtime directory. Set `ATHN_RUNTIME_DIR` to override the location.

## 3. Frontend

In a separate terminal from the root:

```powershell
cd frontend
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

On other platforms use `npm` and `cp`. Open `http://127.0.0.1:5173`. Use the same hostname for both backend and frontend during local testing to avoid cookie issues.

| Role | Identifier | Password environment variable |
| --- | --- | --- |
| Seller A | seller@example.test | ATHN_SELLER_A_PASSWORD |
| Seller B | seller_b@example.test | ATHN_SELLER_B_PASSWORD |
| Rights holder | owner@example.test | ATHN_OWNER_PASSWORD |
| Reviewer | reviewer@example.test | ATHN_REVIEWER_PASSWORD |

If no API configuration is supplied, the Vite development mode can use the original mock fixtures and their non-live test accounts; these are separate from the backend.

## 4. Verify

- Register a new non-sensitive photo as the owner.
- Grant seller A permission; leave seller B without permission.
- Upload the photo as each seller; expect allow and hold respectively.
- Check owner notifications and reviewer evidence; resolve the case and verify an audit ID.
- Restart the backend and verify the saved case; verify role restrictions and unauthenticated image access.
- Run the existing frontend checks in `frontend/`: `npm run typecheck`, `npm run lint`, `npm run build`. To exercise the original mock Playwright tests, run without the live API environment: `npx playwright install chromium`, then `npm test`.

## 5. Deployment boundary

This repository is not a deployed service. Before exposing it, use HTTPS, same-site frontend/backend domains or a suitable reverse proxy, exact CORS origins, secure cookies (`ATHN_COOKIE_SECURE=true`), secret management, storage quotas, rate limits, and fresh demo data. Keep the runtime on persistent private storage. Configure any public application URLs so the generated evidence links are reachable through the trusted proxy. Review backup and privacy policies, and verify the complete flow on the target host.
