from ultralytics import YOLO
from pathlib import Path

def main():
    model_path = r"C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt"
    iwhr_yaml = r"C:\PEP_2026\unified_dataset\iwhr_test.yaml"

    Path(iwhr_yaml).write_text(
        """path: C:/PEP_2026/unified_dataset
train: iwhr_val.txt
val: iwhr_val.txt
test: iwhr_test.txt
names:
  0: floating_waste
""",
        encoding="utf-8"
    )

    model = YOLO(model_path)

    results = model.val(
        data=iwhr_yaml,
        split="test",
        imgsz=640,
        batch=8,
        device=0,
        workers=4,
        conf=0.25,
        project=r"C:\PEP_2026\results",
        name="yolo26s_p2_iwhr_test",
        exist_ok=True,
        plots=True
    )

    print("\n===== YOLO26s-P2 | IWHR TEST =====")
    print(f"Precision: {results.box.mp:.4f}")
    print(f"Recall:    {results.box.mr:.4f}")
    print(f"mAP50:     {results.box.map50:.4f}")
    print(f"mAP50-95:  {results.box.map:.4f}")

if __name__ == "__main__":
    main()
