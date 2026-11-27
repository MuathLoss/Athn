# Architecture and boundaries

Seller upload -> authenticated FastAPI analyze route -> normalized 512-dimensional SSCD embedding -> cosine top-k retrieval -> geometric SIFT/RANSAC verification when required -> simulated registry and seller permission lookup -> allow, review or hold_for_review.

React/Vite calls FastAPI over HTTP(S) with cookies. SQLite persists registry entries, new embedding vectors, permissions, verification records, notifications, review cases and audit entries. Original model and reference embeddings are loaded at startup; dynamic embeddings are combined at query time. Image evidence lives on disk. Human decisions use revision checks and are recorded separately from the initial machine decision.

## API

- /health, /register, /analyze
- /portal/session, /portal/sign-in, /portal/sign-out, /portal/marketplace-session
- /portal/overview, /portal/works, /portal/works/{id}, /portal/activity
- /portal/works/{id}/permissions/{seller_id} (PUT / DELETE)
- /portal/verifications/{id}, /portal/verification-image/{id}
- /portal/notifications, /portal/notifications/{id}/read
- /portal/review/queue, /portal/review/cases/{id}, /prepare and /submit under the case path

## Deployment prerequisites (not completed)

- Run a clean regression build and full workflow test after the source move and configuration changes.
- Use persistent storage for SQLite and uploaded images; use one backend instance until concurrency and multi-instance storage are addressed.
- Keep real passwords in server environment configuration; use new passwords, HTTPS, secure cookies, same-site routing, explicit allowed origins, CSRF defenses, rate limits and stronger authentication. Cross-site cookie deployments need additional design.
- Restrict reference image access: the current /images static route is publicly readable. Do not expose private runtime assets until this is fixed.
- Use a fresh demo database or sanitize imported snapshots and invalidate old sessions. Establish upload retention, disk quotas and backups.
- The reviewer evidence UI may show registry source unavailable; complete its related-work metadata wiring before public presentation.
- Duplicate registration prevention, comprehensive independent negative-image validation and operational monitoring are not yet implemented.
- Review decisions are audit records inside the prototype; no actual marketplace publication callback or SAIP integration exists.

The original UI design documentation is retained under docs/sources/ and docs/ui-inspiration.md. It describes the historical frontend design, not necessarily the latest backend behavior.
