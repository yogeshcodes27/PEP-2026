# RobustFloat — Top 5 Model Results

## Top 5 Models

| Rank | Model | Training / Evaluation | TUD-GV F1 | IWHR F1 | mAP@50 | mAP@50–95 | Inference |
|---:|---|---|---:|---:|---:|---:|---:|
| **1** | **YOLO26s-P2 Unified** | TUD-GV + IWHR | **93.72%** | **76.66%** | 93.60% / 73.48% | 71.99% / 51.78% | 15.80 ms/img* |
| **2** | **YOLOv8s 640** | TUD-GV | **93.40%** | 42.16% zero-shot | **97.10%** | 74.90% | **9.30 ms/img** |
| **3** | **YOLOv8s 960** | TUD-GV | 93.07% | — | **97.30%** | **76.40%** | 16.73 ms/img |
| **4** | **YOLO26n + IWHR Adaptation** | IWHR official test | — | **~76.84%** | 73.90% | 52.40% | **3.41 ms/img** |
| **5** | **YOLO26n** | TUD-GV | 92.27% | — | 96.50% | 73.20% | **2.90 ms/img** |

\*15.80 ms/image is the reported YOLO26s-P2 Unified inference speed on the TUD-GV test run. IWHR speed was not retained in the final result record.

### Metric details

For models evaluated on a single domain:

| Model | Domain | Precision | Recall | F1 | mAP@50 | mAP@50–95 |
|---|---|---:|---:|---:|---:|---:|
| **YOLOv8s 640** | TUD-GV | 92.40% | 94.42% | **93.40%** | 97.10% | 74.90% |
| **YOLOv8s 960** | TUD-GV | 91.63% | 94.56% | 93.07% | 97.30% | 76.40% |
| **YOLO26n + IWHR Adaptation** | IWHR official test | 85.10% | 70.10% | **~76.84%** | 73.90% | 52.40% |
| **YOLO26n** | TUD-GV | 89.97% | 94.69% | 92.27% | 96.50% | 73.20% |

### YOLO26s-P2 Unified

| Domain | Precision | Recall | F1 | mAP@50 | mAP@50–95 |
|---|---:|---:|---:|---:|---:|
| **TUD-GV Test** | **97.32%** | 90.37% | **93.72%** | 93.60% | 71.99% |
| **IWHR Test** | **86.61%** | 68.76% | **76.66%** | 73.48% | 51.78% |

## Current Overall Model

**YOLO26s-P2 Unified**

```text
Architecture : YOLO26s-P2
Layers       : 329
Parameters   : 9,765,856
GFLOPs       : 28.0
Classes      : 1 (floating_waste)
Scales       : P2 / P3 / P4 / P5
```

It is the current primary model because **one checkpoint covers both TUD-GV and IWHR** with strong performance on both domains.

## Primary Checkpoint

```text
C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt
```
