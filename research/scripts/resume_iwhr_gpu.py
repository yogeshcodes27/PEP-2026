from ultralytics import YOLO
import torch

def main():
    assert torch.cuda.is_available(), "CUDA NOT AVAILABLE"

    torch.cuda.set_device(0)

    print("CUDA:", torch.cuda.is_available())
    print("GPU:", torch.cuda.get_device_name(0))

    model = YOLO(
        r"C:\PEP_2026\experiments\yolo26n_iwhr_finetune\weights\last.pt"
    )

    model.train(
        resume=True,
        device=0,
        batch=-1,
        workers=4,
        cache=True,
        amp=True
    )

if __name__ == "__main__":
    main()
