# PEP 2026 — Floating Waste Detection

## TUD-GV Dataset

| Item | Value |
|---|---:|
| Images | 1,501 |
| Bounding boxes | 8,181 |
| Classes | 1 (`litter`) |
| Train | 1,015 images / 5,460 boxes |
| Validation | 230 images / 1,215 boxes |
| Test | 256 images / 1,506 boxes |

## IWHR Dataset

| Item | Value |
|---|---:|
| Images | 3,000 |
| XML annotations | 3,000 |
| Original bounding boxes | 23,692 |
| Class | 1 (`floater`) |
| Valid unchanged | 23,587 |
| Clipped | 102 |
| Removed | 3 |
| Final boxes | 23,689 |

Clean dataset:
`C:\PEP_2026\iwhr_clean`

Cleaning report:
`C:\PEP_2026\iwhr_clean\cleaning_report.csv`

## Model Results

| Model | Precision | Recall | F1 | mAP50 | mAP50-95 | Latency | FPS |
|---|---:|---:|---:|---:|---:|---:|---:|
| YOLOv8s 640 Baseline | 92.40% | 94.42% | **93.40%** | 0.971 | 0.749 | **9.30 ms** | **107.48** |
| YOLOv8s 960 High-Resolution | 91.63% | 94.56% | 93.07% | **0.973** | **0.764** | 16.73 ms | 59.73 |
| Tiled YOLOv8s | 87.07% | 71.51% | 78.53% | — | — | 100.56 ms | 9.94 |
| Coarse-to-Fine | 78.62% | 83.73% | 81.09% | — | — | 111.15 ms | 9.00 |

## Published External Models

| Model | Precision | Recall | F1 |
|---|---:|---:|---:|
| Published Tiles Checkpoint | 75.37% | 70.95% | 73.09% |
| Published Resize Checkpoint | 25.83% | 54.47% | 35.04% |

## Current Reference Model

**YOLOv8s 640 Baseline**

F1: **93.40%**  
Latency: **9.30 ms/image**  
FPS: **107.48**

## Model / Experiment Locations

```text
C:\PEP_2026\experiments\baseline_640-4
C:\PEP_2026\experiments\highres_960-2
C:\PEP_2026\experiments\tiled
C:\PEP_2026\experiments\coarse_to_fine
C:\PEP_2026\experiments\benchmark_inference_cost.json
```

## Training Results CSV

```text
C:\PEP_2026\experiments\baseline_640-4\results.csv
C:\PEP_2026\experiments\highres_960-2\results.csv
```

## Cross-Domain Evaluation

**TUD-GV → IWHR:** Pending
