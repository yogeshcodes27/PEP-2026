# RobustFloat — Model Overview

RobustFloat is a floating-waste detection system for inland-water imagery.

The current primary model is YOLO26s-P2 Unified.

The model uses one application class:
floating_waste

Architecture:
- 329 layers
- 9,765,856 parameters
- 28.0 GFLOPs
- P2 / P3 / P4 / P5 detection scales

The model was trained jointly on TUD-GV and IWHR.

The application should describe detections as model detections at a selected confidence threshold, not as exact physical counts of all waste present.
