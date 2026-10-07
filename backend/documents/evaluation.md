# RobustFloat — Evaluation

The final YOLO26s-P2 Unified model was evaluated on held-out TUD-GV and IWHR test sets.

TUD-GV test:
- 256 images
- 1,506 instances
- Precision: 97.32%
- Recall: 90.37%
- F1: 93.72%
- mAP@50: 93.60%
- mAP@50-95: 71.99%
- Confidence threshold: 0.25

IWHR test:
- 450 images
- 3,660 instances
- Precision: 86.61%
- Recall: 68.76%
- F1: 76.66%
- mAP@50: 73.48%
- mAP@50-95: 51.78%
- Confidence threshold: 0.25

The compute-matched YOLO26s-P2 TUD-only model achieved:
- TUD-GV F1: 94.23%
- IWHR F1: 20.92%

This demonstrates substantial domain shift between the evaluated datasets.

Performance on a completely unseen third water-domain dataset has not been established.
