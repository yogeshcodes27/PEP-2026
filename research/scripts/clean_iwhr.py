from pathlib import Path
import shutil
import csv
import xml.etree.ElementTree as ET

PACKAGES = [
    Path(r"C:\PEP_2026\data\IWHR_AI_Lable_Floater_V1-package1"),
    Path(r"C:\PEP_2026\data\IWHR_AI_Lable_Floater_V1-package2"),
]

OUT = Path(r"C:\PEP_2026\iwhr_clean")
IMAGE_OUT = OUT / "images"
LABEL_OUT = OUT / "labels"

IMAGE_OUT.mkdir(parents=True, exist_ok=True)
LABEL_OUT.mkdir(parents=True, exist_ok=True)

report = []

total_images = 0
total_objects = 0
valid_boxes = 0
clipped_boxes = 0
removed_boxes = 0

for base in PACKAGES:

    image_dir = base / "JPEGImages"
    xml_dir = base / "Annotations"

    for xml_path in sorted(xml_dir.glob("*.xml"), key=lambda p: int(p.stem)):

        image_name = f"{xml_path.stem}.jpg"
        image_path = image_dir / image_name

        if not image_path.exists():
            raise FileNotFoundError(f"Missing image: {image_path}")

        root = ET.parse(xml_path).getroot()

        width = int(root.find("size/width").text)
        height = int(root.find("size/height").text)

        # Copy image using the same numeric filename
        shutil.copy2(image_path, IMAGE_OUT / image_name)

        yolo_lines = []

        for obj_idx, obj in enumerate(root.findall("object"), start=1):

            class_name = obj.findtext("name", "").strip()

            if class_name != "floater":
                report.append({
                    "image": image_name,
                    "object_index": obj_idx,
                    "action": "REMOVED_UNKNOWN_CLASS",
                    "reason": class_name
                })
                removed_boxes += 1
                continue

            box = obj.find("bndbox")

            xmin = int(box.findtext("xmin"))
            ymin = int(box.findtext("ymin"))
            xmax = int(box.findtext("xmax"))
            ymax = int(box.findtext("ymax"))

            total_objects += 1

            original = (xmin, ymin, xmax, ymax)

            # Remove degenerate boxes
            if xmax <= xmin or ymax <= ymin:
                report.append({
                    "image": image_name,
                    "object_index": obj_idx,
                    "action": "REMOVED",
                    "reason": "degenerate",
                    "original_box": str(original),
                    "cleaned_box": ""
                })
                removed_boxes += 1
                continue

            # Clip coordinates to image boundaries
            clipped_xmin = max(0, min(xmin, width - 1))
            clipped_ymin = max(0, min(ymin, height - 1))
            clipped_xmax = max(0, min(xmax, width))
            clipped_ymax = max(0, min(ymax, height))

            cleaned = (
                clipped_xmin,
                clipped_ymin,
                clipped_xmax,
                clipped_ymax
            )

            # Check again after clipping
            if clipped_xmax <= clipped_xmin or clipped_ymax <= clipped_ymin:
                report.append({
                    "image": image_name,
                    "object_index": obj_idx,
                    "action": "REMOVED",
                    "reason": "degenerate_after_clipping",
                    "original_box": str(original),
                    "cleaned_box": str(cleaned)
                })
                removed_boxes += 1
                continue

            if cleaned != original:
                action = "CLIPPED"
                clipped_boxes += 1
            else:
                action = "VALID"
                valid_boxes += 1

            # Convert Pascal VOC -> YOLO
            x_center = ((clipped_xmin + clipped_xmax) / 2) / width
            y_center = ((clipped_ymin + clipped_ymax) / 2) / height
            box_width = (clipped_xmax - clipped_xmin) / width
            box_height = (clipped_ymax - clipped_ymin) / height

            yolo_lines.append(
                f"0 {x_center:.8f} {y_center:.8f} "
                f"{box_width:.8f} {box_height:.8f}"
            )

            if action == "CLIPPED":
                report.append({
                    "image": image_name,
                    "object_index": obj_idx,
                    "action": action,
                    "reason": "boundary_overflow",
                    "original_box": str(original),
                    "cleaned_box": str(cleaned)
                })

        # Every image gets a label file
        label_path = LABEL_OUT / f"{xml_path.stem}.txt"
        label_path.write_text(
            "\n".join(yolo_lines),
            encoding="utf-8"
        )

        total_images += 1

# Save cleaning report
report_path = OUT / "cleaning_report.csv"

fieldnames = [
    "image",
    "object_index",
    "action",
    "reason",
    "original_box",
    "cleaned_box"
]

with report_path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(report)

print("\n========== IWHR CLEANING COMPLETE ==========")
print(f"Images processed:       {total_images}")
print(f"Original objects:       {total_objects}")
print(f"Valid unchanged boxes:  {valid_boxes}")
print(f"Clipped boxes:          {clipped_boxes}")
print(f"Removed boxes:          {removed_boxes}")
print(f"Final boxes:            {valid_boxes + clipped_boxes}")
print(f"\nOutput: {OUT}")
print(f"Report: {report_path}")
