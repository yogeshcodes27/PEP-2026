from ultralytics import YOLO
from pathlib import Path
import cv2

MODEL = r"C:\PEP_2026\experiments\yolo26n_640\weights\best.pt"
IMG_DIR = Path(r"C:\PEP_2026\dataset\images\val")
LBL_DIR = Path(r"C:\PEP_2026\dataset\labels\val")

IOU_THRESHOLD = 0.50
CONF_THRESHOLDS = [0.25,0.30,0.35,0.40,0.45,0.50,0.55,0.60,0.65,0.70,0.75,0.80,0.85,0.90]

def iou(a,b):
    ax1,ay1,ax2,ay2=a
    bx1,by1,bx2,by2=b
    ix1=max(ax1,bx1); iy1=max(ay1,by1)
    ix2=min(ax2,bx2); iy2=min(ay2,by2)
    inter=max(0,ix2-ix1)*max(0,iy2-iy1)
    aa=max(0,ax2-ax1)*max(0,ay2-ay1)
    ab=max(0,bx2-bx1)*max(0,by2-by1)
    u=aa+ab-inter
    return inter/u if u>0 else 0

model=YOLO(MODEL)
images=sorted(IMG_DIR.glob("*.jpg"))
all_data=[]

for idx,image_path in enumerate(images,1):
    img=cv2.imread(str(image_path))
    h,w=img.shape[:2]

    gt=[]
    label_path=LBL_DIR/f"{image_path.stem}.txt"

    for line in label_path.read_text().splitlines():
        p=line.split()
        if len(p)!=5:
            continue
        _,xc,yc,bw,bh=map(float,p)
        xc*=w; yc*=h; bw*=w; bh*=h
        gt.append((xc-bw/2,yc-bh/2,xc+bw/2,yc+bh/2))

    r=model.predict(
        source=str(image_path),
        imgsz=640,
        conf=0.25,
        iou=0.50,
        device=0,
        verbose=False
    )[0]

    preds=[]
    if r.boxes is not None:
        boxes=r.boxes.xyxy.cpu().numpy()
        confs=r.boxes.conf.cpu().numpy()

        for box,conf in zip(boxes,confs):
            preds.append((tuple(box.tolist()),float(conf)))

    all_data.append((gt,preds))

    if idx % 50 == 0:
        print(f"Processed {idx}/{len(images)}")

print("\n===== YOLO26n VALIDATION CONFIDENCE SWEEP =====")

best=None

for conf_threshold in CONF_THRESHOLDS:

    TP=FP=FN=0

    for gt,preds in all_data:

        preds=[p[0] for p in preds if p[1] >= conf_threshold]

        matches=[]

        for pi,pred in enumerate(preds):
            for gi,g in enumerate(gt):
                s=iou(pred,g)
                if s>=IOU_THRESHOLD:
                    matches.append((s,pi,gi))

        matches.sort(reverse=True)

        matched_p=set()
        matched_g=set()

        for s,pi,gi in matches:
            if pi not in matched_p and gi not in matched_g:
                matched_p.add(pi)
                matched_g.add(gi)

        tp=len(matched_p)
        TP+=tp
        FP+=len(preds)-tp
        FN+=len(gt)-tp

    precision=TP/(TP+FP) if TP+FP else 0
    recall=TP/(TP+FN) if TP+FN else 0
    f1=2*precision*recall/(precision+recall) if precision+recall else 0

    print(
        f"conf={conf_threshold:.2f} "
        f"TP={TP} FP={FP} FN={FN} "
        f"P={precision:.4f} R={recall:.4f} F1={f1:.4f}"
    )

    if best is None or f1 > best[0]:
        best=(f1,conf_threshold,TP,FP,FN,precision,recall)

print("\n===== SELECTED YOLO26n THRESHOLD =====")
print(f"Confidence: {best[1]:.2f}")
print(f"TP: {best[2]}")
print(f"FP: {best[3]}")
print(f"FN: {best[4]}")
print(f"Precision: {best[5]:.4f}")
print(f"Recall: {best[6]:.4f}")
print(f"F1: {best[0]:.4f}")
