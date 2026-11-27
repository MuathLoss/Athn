# Architecture and data flow

The frontend exposes an Arabic seller workspace, rights-holder portal and reviewer portal. The backend uses role-bound sessions, SQLite persistence, an indexed SSCD reference set and on-demand geometric verification.

## Detection

1. Validate the uploaded photograph; resize to 320 × 320 and apply the model's normalization.
2. Generate an L2-normalized 512-dimensional SSCD embedding and retrieve the top five reference matches by cosine similarity.
3. High-confidence similarity (0.85 or higher) is treated as a high-risk match. Scores at or above 0.40 are reviewed; candidates at or above 0.45 may be geometrically verified using SIFT, Lowe ratio 0.75, RANSAC 3 px, at least 12 inliers and an inlier ratio of at least 0.50.
4. Look up the matched simulated registration and seller authorization. Return allow, review or hold-for-review. Preserve the AI decision as evidence; human decisions are separately audited.

See [frozen research thresholds](../research/detection_config.json). New works have their own embeddings stored in SQLite; no retraining is required.

## API groups

| Group | Endpoints |
| --- | --- |
| System | GET /health |
| Authentication | GET /portal/session, POST /portal/sign-in, POST /portal/sign-out |
| Marketplace | GET /portal/marketplace-session, POST /analyze |
| Registration | POST /register |
| Rights | GET /portal/overview, GET /portal/works, GET /portal/works/{id}, GET /portal/activity |
| Permissions | PUT or DELETE /portal/works/{id}/permissions/{seller_id} |
| Evidence | GET /images/{path}, GET /portal/verifications/{id}, GET /portal/verification-image/{id} |
| Notifications | GET /portal/notifications, POST /portal/notifications/{id}/read |
| Review | GET /portal/review/queue, GET /portal/review/cases/{id}, POST /portal/review/cases/{id}/prepare, POST /portal/review/cases/{id}/submit |

The frontend route mapping is supplied in its environment example. SQLite stores registrations, permissions, embeddings, hashed session tokens, verifications, review cases, notifications and revision-aware audit records. Image files are stored separately in the runtime directory. Review decisions are internal to ATHN; the original AI decision is not overwritten and no actual marketplace enforcement or SAIP connection occurs.
