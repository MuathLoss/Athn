# Local setup and restoration

Use Python 3.11 and Node.js 24 or a compatible version (the original frontend was tested with Node 24; the integrated Windows demo also ran with Node 26). Commands below are Windows PowerShell from the repository root unless noted.

## 1. Clone and restore runtime

```powershell
git clone https://github.com/MuathLoss/Athn.git
cd Athn
```

Restore the directory structure in [EXTERNAL_ASSETS.md](EXTERNAL_ASSETS.md). A clean demo requires the model checkpoint, reference embeddings, registry JSON, detection config and reference photographs. The full 55,000-image research dataset is not required for inference. Do not restore a private database into a shared or public deployment.

## 2. Backend

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install torch==2.9.1 torchvision==0.24.1 --index-url https://download.pytorch.org/whl/cpu
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
notepad backend\.env
```

For compatible NVIDIA hardware, use the appropriate PyTorch CUDA wheel index (the original Windows test used cu128 instead of cpu). Set all four password variables to new, unique values. Empty password values disable sign-in for that account. Never commit backend/.env. The runtime path defaults to the repository-root ATHN_runtime; set ATHN_RUNTIME_DIR to override it.

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn backend:app --host 127.0.0.1 --port 8000 --env-file .env
```

Startup initializes a missing SQLite database from registry.json and creates the dynamic registration, session, verification and review tables. If restoring a private snapshot, preserve the database, new reference images and evidence together and invalidate old sessions before exposing it. For a new deployment, prefer a fresh database. Check http://127.0.0.1:8000/health and http://127.0.0.1:8000/docs.

## 3. Frontend (new terminal, repository root)

```powershell
cd frontend
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173/login. Use the same hostname (127.0.0.1) for API and frontend so local cookies work.

| Role | Account | Password variable |
| --- | --- | --- |
| Seller A | seller@example.test | ATHN_SELLER_A_PASSWORD |
| Seller B | seller_b@example.test | ATHN_SELLER_B_PASSWORD |
| Rights holder | owner@example.test | ATHN_OWNER_PASSWORD |
| Reviewer | reviewer@example.test | ATHN_REVIEWER_PASSWORD |

These are prototype accounts. The original frontend also includes separate development-only mock accounts for browser tests; their public fixture passwords are **not** live backend passwords.

## 4. Regression checks

From frontend/:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

Run original mock-mode tests without .env.local or VITE API variables; restore live configuration afterward. Then manually test a new registration, grant Seller A access, submit the same image as both sellers, verify owner notification and evidence, submit a reviewer decision, restart and verify persistence and forbidden-role requests. Test exact, modified and independently taken photographs. Do not infer broad accuracy from this small workflow test.

For production, choose a persistent runtime volume, configure HTTPS and same-site routing, rate limiting and authentication hardening. See [ARCHITECTURE.md](ARCHITECTURE.md).
