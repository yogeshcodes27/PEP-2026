# Robust Floating Waste Detection in Inland Waters Using Deep Learning and Cross-Domain Evaluation

## Project Overview
This research project focuses on accurate and efficient detection of floating litter in inland water environments (rivers, canals, lakes) using deep learning object detection architectures, tailored high-resolution strategies, and rigorous cross-domain evaluation.

---

## Research Directions
- **Floating Litter Detection:** Detecting various types of surface debris in complex aquatic scenes with glint, reflections, ripples, and background clutter.
- **Small-Object Detection:** Overcoming miss rates for small, distant, or semi-submerged floating litter items.
- **High-Resolution Inference:** Assessing higher input resolutions (e.g., 960×960) to preserve fine details.
- **Tiled Inference:** Utilizing overlapping tile / patch-based inference to maintain native resolution detection capabilities on large images.
- **Coarse-to-Fine Inference:** Implementing a two-stage approach with rapid region-of-interest proposals followed by selective localized tiling for computational efficiency.
- **Cross-Domain Evaluation:** Validating generalization performance on unseen water bodies and external environmental datasets.
- **Error Analysis:** Categorizing false positives (e.g., vegetation, water turbulence, reflections) and false negatives across object scale distributions.

---

## Current Dataset
- **Name:** TUD-GV Object Detection Dataset
- **Total Images:** 1,501 images
- **Classes:** 1 class (`0: litter`)
- **Format:** YOLO annotation format (`class_id x_center y_center width height`)
- **Raw Storage:** `data_raw/` (immutable original copy)
- **Training Preparation:** `dataset/` (partitioned train/val/test splits defined via `dataset.yaml`)

---

## Initial Experimental Pipeline
```
Existing Published Floating-Litter Model
                 ↓
          YOLOv8s Baseline (640×640)
                 ↓
       High-Resolution (960×960)
                 ↓
            Tiled Inference
                 ↓
         Coarse-to-Fine Inference
                 ↓
       Cross-Domain Evaluation & Error Analysis
```

---

## Repository Structure
```
C:\PEP_2026\
├── data_raw/            # Immutable original raw dataset (images, labels, classes)
│   ├── images/          # 1501 original JPG images
│   ├── labels_txt/      # 1501 original YOLO TXT files
│   ├── classes.txt      # Class mapping (litter)
│   └── README.md        # Dataset documentation
│
├── dataset/             # Training-ready dataset (populated by split script)
│   ├── images/          # train/, val/, test/
│   ├── labels/          # train/, val/, test/
│   └── dataset.yaml     # YOLO dataset configuration
│
├── models/              # Model weights repository
│   ├── pretrained/      # External / downloaded pretrained weights
│   │   └── floating_litter/
│   └── trained/         # Models trained within this project
│       ├── baseline_yolov8s/
│       ├── highres_yolov8s/
│       ├── tiled_yolov8s/
│       └── coarse_to_fine/
│
├── scripts/             # Modular pipeline scripts
│   ├── validate_dataset.py  # Check annotation integrity & data hygiene
│   ├── visualize_labels.py  # Visual bbox verification
│   ├── split_dataset.py     # Partition train/val/test
│   ├── train_baseline.py    # YOLOv8s baseline training
│   ├── evaluate.py          # Metrics & cross-domain evaluation
│   └── tiled_inference.py   # Sliced tile inference & NMS merging
│
├── experiments/         # Structured experiment logs & configurations
│   ├── existing_model_test/
│   ├── baseline_640/
│   ├── highres_960/
│   ├── tiled/
│   └── coarse_to_fine/
│
├── results/             # Consolidated evaluation outputs
│   ├── metrics/         # Numerical reports (precision, recall, mAP, FPS)
│   ├── plots/           # Training curves, PR curves, confusion matrices
│   └── predictions/     # Visual prediction outputs & qualitative samples
│
├── notebooks/           # Jupyter notebooks for exploratory analysis
├── README.md            # Project description & guidelines
├── requirements.txt     # Python dependency specifications
└── .gitignore           # Git ignore rules for ML workflows
```
