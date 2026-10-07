from pathlib import Path
import xml.etree.ElementTree as ET
from collections import defaultdict
import shutil
import random
import csv

PACKAGE1 = Path(r"C:\PEP_2026\data\IWHR_AI_Lable_Floater_V1-package1")
PACKAGE2 = Path(r"C:\PEP_2026\data\IWHR_AI_Lable_Floater_V1-package2")
CLEAN = Path(r"C:\PEP_2026\iwhr_clean")
OUT = Path(r"C:\PEP_2026\iwhr_adaptation")

random.seed(42)

packages = [
    (PACKAGE1, PACKAGE1 / "JPEGImages" / "Annotations"),
    (PACKAGE2, PACKAGE2 / "Annotations"),
]

groups = defaultdict(list)

for package, ann_dir in packages:

    for xml_path in ann_dir.glob("*.xml"):

        root = ET.parse(xml_path).getroot()

        folder = root.findtext("folder") or "UNKNOWN"
        source_path = root.findtext("path") or "UNKNOWN"

        if source_path != "UNKNOWN":
            source_path = str(Path(source_path).parent)

        # Normalize source-group key
        source_key = f"{folder}|{source_path}".lower()

        local_id = int(xml_path.stem)

        groups[source_key].append({
            "id": local_id,
            "boxes": len(root.findall("object"))
        })

print(f"Unique source groups: {len(groups)}")

# Sort largest groups first
group_items = sorted(
    groups.items(),
    key=lambda x: len(x[1]),
    reverse=True
)

total_images = sum(len(v) for v in groups.values())

targets = {
    "train": total_images * 0.70,
    "val": total_images * 0.15,
    "test": total_images * 0.15
}

split_images = {
    "train": 0,
    "val": 0,
    "test": 0
}

assignments = {}

# Greedy group assignment
for source_key, items in group_items:

    split = min(
        split_images,
        key=lambda s: split_images[s] / targets[s]
    )

    assignments[source_key] = split
    split_images[split] += len(items)

print("\nSplit totals:")
for split in ["train", "val", "test"]:
    print(
        f"{split}: "
        f"{split_images[split]} images "
        f"({split_images[split] / total_images * 100:.2f}%)"
    )

# Create directories
for split in ["train", "val", "test"]:
    (OUT / "images" / split).mkdir(parents=True, exist_ok=True)
    (OUT / "labels" / split).mkdir(parents=True, exist_ok=True)

manifest = []

for source_key, items in groups.items():

    split = assignments[source_key]

    for item in items:

        image_id = item["id"]

        image_name = f"{image_id:04d}.jpg" if image_id <= 1500 else f"{image_id}.jpg"
        label_name = f"{image_id:04d}.txt" if image_id <= 1500 else f"{image_id}.txt"

        src_image = CLEAN / "images" / image_name
        src_label = CLEAN / "labels" / label_name

        if not src_image.exists():
            raise FileNotFoundError(src_image)

        if not src_label.exists():
            raise FileNotFoundError(src_label)

        shutil.copy2(
            src_image,
            OUT / "images" / split / image_name
        )

        shutil.copy2(
            src_label,
            OUT / "labels" / split / label_name
        )

        manifest.append({
            "image": image_name,
            "split": split,
            "source_group": source_key,
            "boxes": item["boxes"]
        })

# Save manifest
with open(OUT / "split_manifest.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=["image", "split", "source_group", "boxes"]
    )
    writer.writeheader()
    writer.writerows(manifest)

# Dataset YAML
yaml = """path: C:/PEP_2026/iwhr_adaptation
train: images/train
val: images/val
test: images/test
names:
  0: litter
"""

(OUT / "dataset.yaml").write_text(yaml, encoding="utf-8")

print("\nCreated:")
print(OUT)
print(OUT / "dataset.yaml")
print(OUT / "split_manifest.csv")
