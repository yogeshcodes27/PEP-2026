from ultralytics import YOLO
import torch

MODEL = r"C:\PEP_2026\yolo26s-p2.yaml"

def train_tud():
    print("\n========== YOLO26s-P2 | TUD ONLY ==========\n")

    model = YOLO(MODEL)

    model.train(
        data=r"C:\PEP_2026\controlled_tud_only.yaml",
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
        name="yolo26s_p2_tud_only",
        exist_ok=False,
        plots=True
    )


def train_iwhr():
    print("\n========== YOLO26s-P2 | IWHR ONLY ==========\n")

    model = YOLO(MODEL)

    model.train(
        data=r"C:\PEP_2026\controlled_iwhr_only.yaml",
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
        name="yolo26s_p2_iwhr_only",
        exist_ok=False,
        plots=True
    )


def main():
    print("CUDA:", torch.cuda.is_available())
    print("GPU:", torch.cuda.get_device_name(0))

    train_tud()
    train_iwhr()

    print("\n========== BOTH CONTROLLED RUNS COMPLETE ==========")


if __name__ == "__main__":
    main()
