from ultralytics import YOLO

model = YOLO(r"C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt")

model.val(
    data=r"C:\PEP_2026\unified_dataset\dataset.yaml",
    split="test",
    imgsz=640,
    batch=8,
    device=0,
    workers=4,
    conf=0.25,
    project=r"C:\PEP_2026\results",
    name="yolo26s_p2_combined_test",
    exist_ok=True
)
