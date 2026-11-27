# ATHN (إذن / IDHN)

**AI-assisted image-rights verification before marketplace publication.**

ATHN is a LegalTech hackathon prototype that compares seller-submitted product photos with registered photographs, checks recorded seller authorization, and routes uncertain or unauthorized usage to human review. It protects photographs rather than product identity. The Arabic, right-to-left interface supports sellers, rights holders and reviewers.

## What works

- Image-copy retrieval using pretrained SSCD embeddings and cosine similarity, with SIFT/RANSAC geometric verification for borderline candidates.
- Dynamic image registration and seller permission management with persistent SQLite storage.
- Authenticated seller checks, usage history, in-app owner notifications, review evidence, decisions and audit records.
- A local end-to-end demonstration passed: authorized seller allowed, unauthorized seller held, owner notified, reviewer decision recorded and persisted after restart, and one role restriction verified.
- A separate local demonstration recognized an exact and edited copy of a newly registered photo while allowing an independently taken photo of the same product.

The registry is simulated, not an official Saudi Authority for Intellectual Property (SAIP) integration. No real marketplace publishing, external notification delivery or legal enforcement is performed. A similarity score is not a legal determination.

## Repository

| Directory | Contents |
| --- | --- |
| [frontend/](frontend/) | React, TypeScript, Vite, Arabic interface, original design implementation and browser tests |
| [backend/](backend/) | FastAPI, SSCD + SIFT/RANSAC, SQLite, sessions, permissions and review workflow |
| [research/](research/) | Colab source export, aggregate results and research notes |
| [docs/](docs/) | Setup, architecture, dataset, external-asset inventory and original design documentation |

## Run locally

1. Request access to the [private project Drive](https://drive.google.com/drive/folders/1LRAvdL-bINHn_J3GLlWBMCYhTVNmJtwE) and restore the required assets into `ATHN_runtime/` at repository root.
2. Follow [setup instructions](docs/SETUP.md) for Python 3.11, the PyTorch CPU/CUDA stack and Node.js.
3. Configure four backend demo passwords and the frontend API environment using the provided templates.
4. Start FastAPI and Vite in separate terminals. Open http://127.0.0.1:5173/login.

The repository is intentionally source-only. **Every omitted asset, its location and restoration procedure are listed in [External assets and backups](docs/EXTERNAL_ASSETS.md).** The Drive is access-controlled; public repository access does not grant access to private files.

## Research results

| Metric (held-out manipulated-photo queries) | Result |
| --- | ---: |
| Top-1 correct source retrieval | 94.66% |
| Top-3 correct source retrieval | 97.33% |
| Top-5 correct source retrieval | 97.99% |
| Flagged by hybrid system | 94.65% |
| Correctly flagged and correct source identified | 91.15% |

The research dataset has 5,000 reference images and 50,000 query images (55,000 total), including 25,000 synthetic manipulations. The held-out manipulated subset contains 15,000 queries. These are retrieval and detection measurements, **not overall infringement-detection accuracy**. Candidate negative labels are noisy; independent false-positive evaluation is still required. See [research notes](research/README.md) and [aggregate results](research/results/final_performance.csv).

## Status and limitations

The integrated local prototype was manually exercised before this repository reorganization. The reorganized source still needs a fresh installation, build and end-to-end regression run. Deployment is pending; see [architecture and deployment prerequisites](docs/ARCHITECTURE.md). No claim of production readiness is made.

## Rights

All rights reserved for original ATHN material in this revision; see [LICENSE](LICENSE). Previous MIT grants remain valid. Third-party components retain their own licenses. Dataset attribution: Amazon Berkeley Objects (ABO), Amazon and UC Berkeley, CC BY 4.0; see [dataset notes](docs/DATASET.md). SSCD is a pretrained third-party model from Meta research.
