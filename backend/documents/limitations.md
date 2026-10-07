# RobustFloat — Limitations

The number of detected objects is not necessarily the exact physical number of waste objects present in an environment.

Detector confidence scores should not be interpreted directly as calibrated probabilities of correctness.

Zero detections do not imply that the water is clean.

The current study evaluates TUD-GV and IWHR but does not establish performance on a completely unseen third water-domain dataset.

Domain shift can reduce detector performance when the visual distribution differs from the evaluated datasets.

The application should not infer pollution percentages, ecological health, public-health risk, locations or trends unless those facts are explicitly available in the data.

User corrections are feedback records and should not automatically trigger model retraining.
