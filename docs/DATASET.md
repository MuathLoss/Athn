# Dataset and model

The original image collection is [Amazon Berkeley Objects (ABO)](https://amazon-berkeley-objects.s3.amazonaws.com/index.html), a dataset from Amazon and UC Berkeley, licensed CC BY 4.0. Cite Collins et al., *ABO: Dataset and Benchmarks for Real-World 3D Object Understanding*, CVPR 2022. The ATHN research subset selects and transforms source photographs; attribution and applicable license notices must accompany redistribution. See [external assets](EXTERNAL_ASSETS.md) for storage.

| Category | Prepared images |
| --- | ---: |
| Reference | 5,000 |
| Same-product candidates | 5,000 |
| Unrelated-product candidates | 20,000 |
| Synthetic manipulated copies | 25,000 |
| Total | 55,000 |

The 50,000 query images were split 40/60 by source/product into 20,000 calibration and 30,000 held-out queries. All 5,000 reference vectors were indexed. Five synthetic manipulation families include compression/color, rotation/mirroring, crop, overlay and combined changes. pHash and geometric screening identified potentially noisy candidate negatives; a limited stratified audit did not establish population false-positive rates.

The model is pretrained SSCD Disc Mixup, from [Meta SSCD copy detection](https://github.com/facebookresearch/sscd-copy-detection). Obtain model weights from the authorized archive or original provider and check the upstream code/checkpoint license before redistributing. ATHN did not train SSCD from scratch.

No full dataset, images, or weights are included in Git. Original study manifests and per-image results are retained privately.
