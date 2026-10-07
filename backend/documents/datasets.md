# RobustFloat — Dataset Information

TUD-GV:
- 1,501 images
- 8,181 annotated bounding boxes
- original class: litter

IWHR:
- 3,000 images
- 23,689 cleaned bounding boxes
- original class: floater

Both datasets are mapped to the application class:
floating_waste

The datasets use group-aware splitting procedures to reduce leakage between training, validation and test data.

The unified training setup uses domain balancing by oversampling TUD-GV training images to match IWHR training exposure.

Dataset provenance, licenses and original source citations should be documented separately before public release.
