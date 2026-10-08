# RobustFloat — Dataset and Model Benchmark

## 1. Dataset Overview

| Dataset | Platform / Source | Environment | Images | Bounding Boxes | Original Class | Unified Class | Purpose |
|---|---|---|---:|---:|---|---|---|
| **TUD-GV** | Google Earth / Satellite | Rivers, lakes, coastal areas | **1,501** | **8,181** | `litter` | `floating_waste` | Detection training, validation and testing |
| **IWHR** | UAV | Diverse inland-water bodies | **3,000** | **23,689 cleaned** | `floater` | `floating_waste` | Detection training, validation and cross-domain testing |
| **Unified** | TUD-GV + IWHR | Heterogeneous | **4,200 effective training entries** | — | — | `floating_waste` | Joint cross-domain detector training |

### TUD-GV Split

| Split | Images | Bounding Boxes |
|---|---:|---:|
| Train | 1,015 | 5,460 |
| Validation | 230 | 1,215 |
| Test | 256 | 1,506 |

### IWHR Split

| Split | Images | Bounding Boxes |
|---|---:|---:|
| Train | 2,100 | 17,013 |
| Validation | 450 | 3,019 |
| Test | 450 | 3,660 |

### Unified Evaluation Sets

| Split | Images | Role |
|---|---:|---|
| Unified Train | **4,200 effective entries** | Joint TUD-GV + IWHR training |
| Unified Validation | **680** | Validation during development |
| Unified Test | **706** | Held-out evaluation across both domains |

> **Unified training class:** `floating_waste`

---

# 2. Model Benchmark

> **Excluded from this benchmark:** coarse-to-fine experiments and tiling-based experiments.

## Top 5 Models

| Rank | Model | Training / Evaluation | TUD-GV F1 | IWHR F1 | TUD-GV mAP@50 | IWHR mAP@50 | TUD-GV mAP@50–95 | IWHR mAP@50–95 | Inference |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|
| **1** | **YOLO26s-P2 Unified** | TUD-GV + IWHR | **93.72%** | **76.66%** | **93.60%** | **73.48%** | **71.99%** | **51.78%** | **15.80 ms/img*** |
| **2** | **YOLOv8s 640** | TUD-GV → zero-shot IWHR | **93.40%** | **42.16%** | **97.10%** | — | **74.90%** | — | **9.30 ms/img** |
| **3** | **YOLOv8s 960** | TUD-GV | **93.07%** | — | **97.30%** | — | **76.40%** | — | **16.73 ms/img** |
| **4** | **YOLO26n + IWHR Adaptation** | IWHR official test | — | **~76.84%** | — | **73.90%** | — | **52.40%** | **3.41 ms/img** |
| **5** | **YOLO26n** | TUD-GV | **92.27%** | — | **96.50%** | — | **73.20%** | — | **2.90 ms/img** |

\* 15.80 ms/image is the retained YOLO26s-P2 Unified TUD-GV inference record. IWHR inference speed was not retained in the final result record.

---

# 3. Full Metrics — YOLO26s-P2 Unified

## TUD-GV Test

| Metric | Value |
|---|---:|
| Precision | **97.32%** |
| Recall | **90.37%** |
| F1-Score | **93.72%** |
| mAP@50 | **93.60%** |
| mAP@50–95 | **71.99%** |
| Inference | **15.80 ms/img*** |

## IWHR Test

| Metric | Value |
|---|---:|
| Precision | **86.61%** |
| Recall | **68.76%** |
| F1-Score | **76.66%** |
| mAP@50 | **73.48%** |
| mAP@50–95 | **51.78%** |
| Inference | — |

---

# 4. Full Metrics — YOLOv8s 640

## TUD-GV Test

| Metric | Value |
|---|---:|
| Precision | **92.40%** |
| Recall | **94.42%** |
| F1-Score | **93.40%** |
| mAP@50 | **97.10%** |
| mAP@50–95 | **74.90%** |
| Inference | **9.30 ms/img** |

## IWHR Zero-Shot Evaluation

| Metric | Value |
|---|---:|
| F1-Score | **42.16%** |
| Precision | — |
| Recall | — |
| mAP@50 | — |
| mAP@50–95 | — |

> This is a zero-shot cross-domain result: the model was trained on TUD-GV and evaluated on IWHR without IWHR training data.

---

# 5. Full Metrics — YOLOv8s 960

## TUD-GV Test

| Metric | Value |
|---|---:|
| Precision | **91.63%** |
| Recall | **94.56%** |
| F1-Score | **93.07%** |
| mAP@50 | **97.30%** |
| mAP@50–95 | **76.40%** |
| Inference | **16.73 ms/img** |

## IWHR

| Metric | Value |
|---|---:|
| F1-Score | — |
| Precision | — |
| Recall | — |
| mAP@50 | — |
| mAP@50–95 | — |

---

# 6. Full Metrics — YOLO26n + IWHR Adaptation

## IWHR Official Test

| Metric | Value |
|---|---:|
| Precision | **85.10%** |
| Recall | **70.10%** |
| F1-Score | **~76.84%** |
| mAP@50 | **73.90%** |
| mAP@50–95 | **52.40%** |
| Inference | **3.41 ms/img** |

## TUD-GV

| Metric | Value |
|---|---:|
| F1-Score | — |
| Precision | — |
| Recall | — |
| mAP@50 | — |
| mAP@50–95 | — |

---

# 7. Full Metrics — YOLO26n

## TUD-GV Test

| Metric | Value |
|---|---:|
| Precision | **89.97%** |
| Recall | **94.69%** |
| F1-Score | **92.27%** |
| mAP@50 | **96.50%** |
| mAP@50–95 | **73.20%** |
| Inference | **2.90 ms/img** |

## IWHR

| Metric | Value |
|---|---:|
| F1-Score | — |
| Precision | — |
| Recall | — |
| mAP@50 | — |
| mAP@50–95 | — |

---

# 8. Controlled and Compute-Matched Detector Experiments

These experiments are reported separately because their training protocols are different from the Top-5 benchmark table.

## Compute-Matched Evaluation

| Model | Evaluation Domain | Precision | Recall | F1 | mAP@50 | mAP@50–95 |
|---|---|---:|---:|---:|---:|---:|
| **TUD-only-4200** | TUD-GV | 96.02% | 92.50% | **94.23%** | 92.87% | 72.37% |
| **TUD-only-4200** | IWHR zero-shot | 25.98% | 17.92% | **21.20%** | 10.33% | 4.85% |
| **IWHR-only-4200** | IWHR | 88.06% | 68.50% | **~77.20%** | 81.11% | 56.23% |
| **Unified YOLO26s-P2** | TUD-GV | 97.32% | 90.37% | **93.72%** | 93.60% | 71.99% |
| **Unified YOLO26s-P2** | IWHR | 86.61% | 68.76% | **76.66%** | 73.48% | 51.78% |

> The **21.20% IWHR F1** is the compute-matched TUD-only zero-shot result used for the main cross-domain comparison.

---

# 9. Controlled 50-Epoch Same-Architecture Matrix

| Training Model | Test Domain | Precision | Recall | F1 | mAP@50 | mAP@50–95 |
|---|---|---:|---:|---:|---:|---:|
| **TUD-only** | TUD-GV | 94.01% | 85.06% | **89.31%** | 92.07% | 67.33% |
| **TUD-only** | IWHR zero-shot | 24.13% | 11.23% | **15.33%** | 5.13% | 2.10% |
| **IWHR-only** | TUD-GV | 85.35% | 70.39% | **77.15%** | 68.73% | 36.29% |
| **IWHR-only** | IWHR | 89.04% | 68.39% | **77.36%** | 73.96% | 52.09% |
| **Unified** | TUD-GV | 97.32% | 90.37% | **93.72%** | 93.60% | 71.99% |
| **Unified** | IWHR | 86.61% | 68.76% | **76.66%** | 73.48% | 51.78% |

---

# 10. Cross-Domain Comparison

## Compute-Matched TUD-Only vs Unified

| Domain | TUD-only F1 | Unified F1 | Change |
|---|---:|---:|---:|
| **TUD-GV** | **94.23%** | **93.72%** | **−0.51 pp** |
| **IWHR** | **21.20%** | **76.66%** | **+55.46 pp** |

### Primary Finding

> **Unified training improves IWHR F1 from 21.20% to 76.66% (+55.46 percentage points), while TUD-GV F1 changes by only −0.51 percentage points.**

This is the central experimental evidence for RobustFloat's cross-domain training strategy.

---

# 11. Model Configuration — Primary Model

| Configuration | Value |
|---|---|
| Architecture | **YOLO26s-P2** |
| Task | Object Detection |
| Layers | **329** |
| Parameters | **9,765,856** |
| GFLOPs | **28.0** |
| Classes | **1** |
| Class | `floating_waste` |
| Detection scales | **P2 / P3 / P4 / P5** |
| Training data | **TUD-GV + IWHR** |
| Primary role | **Unified cross-domain detector** |
| Primary checkpoint | `C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt` |

---

# 12. Model Comparison — Research Interpretation

| Model | TUD-GV Performance | IWHR Performance | Cross-Domain Value | Speed | Role |
|---|---|---|---|---|---|
| **YOLO26s-P2 Unified** | Very strong | **Strong** | **Best overall single-model coverage** | Moderate | **Primary model** |
| **YOLOv8s 640** | Very strong | Weak zero-shot | Limited cross-domain robustness | Fast | Baseline |
| **YOLOv8s 960** | Very strong | Not retained | Not established | Slower | High-resolution baseline |
| **YOLO26n + IWHR Adaptation** | Not evaluated in retained record | **~76.84% F1** | Requires IWHR adaptation | **Fastest adapted model** | Adapted comparison |
| **YOLO26n** | Strong | Not evaluated | Not established | **Fastest TUD baseline** | Lightweight baseline |

---

# 13. Why YOLO26s-P2 Unified Is the Primary Model

The selected model is not the highest model on every individual metric.

For example:

- YOLOv8s 640 has higher TUD-GV mAP@50.
- YOLOv8s 960 has higher TUD-GV mAP@50–95.
- YOLO26n is considerably faster.

However, RobustFloat is not optimizing only for single-domain accuracy or raw inference speed.

The primary objective is:

```text
ONE MODEL
   ↓
TRAIN ON HETEROGENEOUS DOMAINS
   ↓
STRONG TUD-GV PERFORMANCE
   +
STRONG IWHR PERFORMANCE
