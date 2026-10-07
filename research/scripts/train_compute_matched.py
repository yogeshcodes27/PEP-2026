from ultralytics import YOLO
import torch

MODEL = r"C:\PEP_2026\yolo26s-p2.yaml"

def train(name, data):
    model = YOLO(MODEL)

    model.train(
        data=data,
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
        patience=100,
        project=r"C:\PEP_2026\experiments",
        name=name,
        exist_ok=False,
        plots=True
    )

def main():
    print("CUDA:", torch.cuda.is_available())
    print("GPU:", torch.cuda.get_device_name(0))

    train(
        "yolo26s_p2_tud_4200",
        r"C:\PEP_2026\tud_4200.yaml"
    )

    train(
        "yolo26s_p2_iwhr_4200",
        r"C:\PEP_2026\iwhr_4200.yaml"
    )

if __name__ == "__main__":
    main()
