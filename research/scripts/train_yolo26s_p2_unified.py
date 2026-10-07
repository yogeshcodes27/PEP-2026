from ultralytics import YOLO
import torch

def main():
    assert torch.cuda.is_available(), "CUDA NOT AVAILABLE"

    torch.cuda.set_device(0)

    print("CUDA:", torch.cuda.is_available())
    print("GPU:", torch.cuda.get_device_name(0))

    model = YOLO(r"C:\PEP_2026\yolo26s-p2.yaml")

    model.train(
        data=r"C:\PEP_2026\unified_dataset\dataset.yaml",
        epochs=50,
        imgsz=640,
        batch=8,
        nbs=16,
        workers=4,
        device=0,
        cache="ram",
        pretrained=False,
        optimizer="AdamW",
        lr0=0.001,
        seed=42,
        amp=True,
        project=r"C:\PEP_2026\experiments",
        name="yolo26s_p2_unified",
        exist_ok=False,
        plots=True
    )

if __name__ == "__main__":
    main()
