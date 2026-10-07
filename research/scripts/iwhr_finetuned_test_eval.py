from ultralytics import YOLO
from pathlib import Path
import cv2

MODEL = r"C:\PEP_2026\experiments\yolo26n_iwhr_finetune-3\weights\best.pt"
IMG_DIR = Path(r"C:\PEP_2026\iwhr_adaptation\images\test")
LBL_DIR = Path(r"C:\PEP_2026\iwhr_adaptation\labels\test")

CONF = 0.25
IOU_THRESHOLD = 0.50

def iou(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)

    inter = max(0, ix2 - ix1) * max(0, iy2 - iy1)

    area_a = max(0, ax2 - ax1) * max(0, ay2 - ay1)
    area_b = max(0, bx2 - bx1) * max(0, by2 - by1)

    union = area_a + area_b - inter

    return inter / union if union > 0 else 0.0


model = YOLO(MODEL)

TP = 0
FP = 0
FN = 0

images = sorted(IMG_DIR.glob("*.jpg"))

for idx, image_path in enumerate(images, 1):

    img = cv2.imread(str(image_path))

    if img is None:
        print(f"Skipping unreadable image: {image_path}")
        continue

    h, w = img.shape[:2]

    gt_boxes = []

    label_path = LBL_DIR / f"{image_path.stem}.txt"

    for line in label_path.read_text().splitlines():

        parts = line.split()

        if len(parts) != 5:
            continue

        _, xc, yc, bw, bh = map(float, parts)

        xc *= w
        yc *= h
        bw *= w
        bh *= h

        gt_boxes.append((
            xc - bw / 2,
            yc - bh / 2,
            xc + bw / 2,
            yc + bh / 2
        ))

    result = model.predict(
        source=str(image_path),
        imgsz=640,
        conf=CONF,
        iou=0.50,
        device=0,
        verbose=False
    )[0]

    pred_boxes = []

    if result.boxes is not None:
        for box in result.boxes.xyxy.cpu().numpy():
            pred_boxes.append(tuple(box.tolist()))

    matches = []

    for pi, pred in enumerate(pred_boxes):
        for gi, gt in enumerate(gt_boxes):

            score = iou(pred, gt)

            if score >= IOU_THRESHOLD:
                matches.append((score, pi, gi))

    matches.sort(reverse=True)

    matched_pred = set()
    matched_gt = set()

    for score, pi, gi in matches:

        if pi not in matched_pred and gi not in matched_gt:
            matched_pred.add(pi)
            matched_gt.add(gi)

    tp = len(matched_pred)
    fp = len(pred_boxes) - tp
    fn = len(gt_boxes) - tp

    TP += tp
    FP += fp
    FN += fn

    if idx % 50 == 0:
        print(f"Processed {idx}/{len(images)}")


precision = TP / (TP + FP) if TP + FP else 0
recall = TP / (TP + FN) if TP + FN else 0
f1 = (
    2 * precision * recall / (precision + recall)
    if precision + recall else 0
)

print("\n========== IWHR FINE-TUNED CUSTOM TEST ==========")
print(f"Images:    {len(images)}")
print(f"TP:        {TP}")
print(f"FP:        {FP}")
print(f"FN:        {FN}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1:        {f1:.4f}")
print("Confidence: 0.25")
print("IoU:        0.50")
