from ultralytics import YOLO

MODELS = {
    "TUD_only": r"C:\PEP_2026\experiments\yolo26s_p2_tud_only\weights\best.pt",
    "IWHR_only": r"C:\PEP_2026\experiments\yolo26s_p2_iwhr_only\weights\best.pt",
    "Unified": r"C:\PEP_2026\experiments\yolo26s_p2_unified\weights\best.pt",
}

DATASETS = {
    "TUD_test": r"C:\PEP_2026\controlled_tud_only.yaml",
    "IWHR_test": r"C:\PEP_2026\controlled_iwhr_only.yaml",
}

def main():
    results = []

    for model_name, model_path in MODELS.items():
        print("\n" + "=" * 60)
        print(f"MODEL: {model_name}")
        print("=" * 60)

        model = YOLO(model_path)

        for dataset_name, data_path in DATASETS.items():
            print(f"\n--- {model_name} -> {dataset_name} ---")

            r = model.val(
                data=data_path,
                split="test",
                imgsz=640,
                batch=8,
                device=0,
                workers=4,
                conf=0.25,
                project=r"C:\PEP_2026\results",
                name=f"{model_name}_{dataset_name}",
                exist_ok=True,
                plots=True
            )

            p = r.box.mp
            recall = r.box.mr
            f1 = 2 * p * recall / (p + recall) if (p + recall) > 0 else 0

            print(f"Precision: {p:.4f}")
            print(f"Recall:    {recall:.4f}")
            print(f"F1:        {f1:.4f}")
            print(f"mAP50:     {r.box.map50:.4f}")
            print(f"mAP50-95:  {r.box.map:.4f}")

            results.append(
                (model_name, dataset_name, p, recall, f1, r.box.map50, r.box.map)
            )

    print("\n\n" + "=" * 80)
    print("FINAL CONTROLLED MATRIX")
    print("=" * 80)

    for x in results:
        print(
            f"{x[0]:12s} -> {x[1]:10s} | "
            f"P={x[2]:.4f} | R={x[3]:.4f} | F1={x[4]:.4f} | "
            f"mAP50={x[5]:.4f} | mAP50-95={x[6]:.4f}"
        )

if __name__ == "__main__":
    main()
