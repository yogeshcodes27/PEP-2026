from ultralytics import YOLO
from pathlib import Path

def main():
    model_path = r"C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt"
    tud_yaml = r"C:\PEP_2026\unified_dataset\tud_test.yaml"

    Path(tud_yaml).write_text(
        """path: C:/PEP_2026/unified_dataset
train: tud_val.txt
val: tud_val.txt
test: tud_test.txt
names:
  0: floating_waste
""",
        encoding="utf-8"
    )

    model = YOLO(model_path)

    results = model.val(
        data=tud_yaml,
        split="test",
        imgsz=640,
        batch=8,
        device=0,
        workers=4,
        conf=0.25,
        project=r"C:\PEP_2026\results",
        name="yolo26s_p2_tud_test",
        exist_ok=True,
        plots=True
    )

    print("\n===== YOLO26s-P2 | TUD-GV TEST =====")
    print(f"Precision: {results.box.mp:.4f}")
    print(f"Recall:    {results.box.mr:.4f}")
    print(f"mAP50:     {results.box.map50:.4f}")
    print(f"mAP50-95:  {results.box.map:.4f}")

if __name__ == "__main__":
    main()
