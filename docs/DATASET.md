# Dataset and model assets

ATHN uses the Amazon Berkeley Objects (ABO) dataset. The research corpus was assembled from product listings and small images. ABO is distributed under CC BY 4.0; preserve attribution and the dataset's original license. See the [ABO project](https://amazon-berkeley-objects.github.io/) and [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

| Category | Images |
| --- | ---: |
| Reference | 5,000 |
| Same_Product | 5,000 |
| Unrelated | 20,000 |
| Manipulated | 25,000 |
| Total | 55,000 |

Five synthetic manipulation types were generated from reference photographs. Product/source-based splitting produced 20,000 calibration and 30,000 held-out queries. The 15,000 held-out manipulated queries are the basis of the reported manipulation metrics.

The model is pretrained Meta SSCD Disc Mixup ([SSCD repository](https://github.com/facebookresearch/sscd-copy-detection)); model weights and their terms remain separate from ATHN's source license.

The full assets are stored in the authorized [ATHN Google Drive folder](https://drive.google.com/drive/folders/1LRAvdL-bINHn_J3GLlWBMCYhTVNmJtwE). The original `Notebooks/ATHN_AI_Development.ipynb` with outputs, Python export, raw results, all dataset categories and precomputed embeddings are available there. Do not publish private runtime records or user-uploaded evidence.

The repository contains an IPython/Colab source export and aggregate performance table, not the large raw artifacts. The research source includes Colab-specific shell commands and Drive paths and is not part of the application runtime.

## Evaluation limitations

Candidate negatives are not independently established ground truth: products may reuse the same photograph, templates or visual elements. The negative audit was stratified and left many uncertain examples. Do not claim the escalation rate as a false-positive rate or the retrieval rate as overall legal accuracy. A detected match is a review signal, not a legal determination.
