# Research

The Colab development export and aggregate manipulation results are provided for inspection. The original notebook, all per-image results, manifests, model and embeddings are in the [private Drive](https://drive.google.com/drive/folders/1LRAvdL-bINHn_J3GLlWBMCYhTVNmJtwE). See [dataset](../docs/DATASET.md) and [external assets](../docs/EXTERNAL_ASSETS.md).

The frozen hybrid pipeline uses top_k=5, review threshold 0.40, high similarity threshold 0.85, geometric threshold 0.45, minimum 12 inliers and inlier ratio 0.50. Reference embeddings are 512-dimensional and normalized. Held-out manipulated-query results: top-1 94.66%, top-3 97.33%, top-5 97.99%, flagged 94.65%, correct detection and source 91.15%.

The same-product and unrelated candidate groups contain noisy negative labels; their escalation rates cannot be treated as verified false-positive rates. The limited manual audit was stratified and not representative. Independent negative evaluation remains outstanding.
