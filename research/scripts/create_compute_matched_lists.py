from pathlib import Path
import random

SEED = 42
TARGET = 4200

random.seed(SEED)

tud_dir = Path(r"C:\PEP_2026\dataset\images\train")
iwhr_dir = Path(r"C:\PEP_2026\iwhr_adaptation\images\train")
out_dir = Path(r"C:\PEP_2026\unified_dataset")

def get_images(folder):
    return sorted(
        str(p).replace("\\", "/")
        for p in folder.glob("*")
        if p.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]
    )

def make_fixed_list(images, target, output):
    result = []

    # Full repetitions
    full = target // len(images)
    remainder = target % len(images)

    for _ in range(full):
        result.extend(images)

    result.extend(random.sample(images, remainder))

    random.shuffle(result)

    Path(output).write_text(
        "\n".join(result) + "\n",
        encoding="utf-8"
    )

    print(f"{output}")
    print(f"Unique images: {len(images)}")
    print(f"Effective entries: {len(result)}")

tud = get_images(tud_dir)
iwhr = get_images(iwhr_dir)

make_fixed_list(
    tud,
    TARGET,
    out_dir / "tud_only_4200.txt"
)

make_fixed_list(
    iwhr,
    TARGET,
    out_dir / "iwhr_only_4200.txt"
)
