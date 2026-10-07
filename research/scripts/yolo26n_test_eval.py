from ultralytics import YOLO
from pathlib import Path
import cv2

MODEL = r"C:\PEP_2026\experiments\yolo26n_640\weights\best.pt"
IMG_DIR = Path(r"C:\PEP_2026\dataset\images\test")
LBL_DIR = Path(r"C:\PEP_2026\dataset\labels\test")

CONF = 0.25
IOU_THRESHOLD = 0.50

def iou(a,b):
    ax1,ay1,ax2,ay2=a
    bx1,by1,bx2,by2=b
    ix1=max(ax1,bx1); iy1=max(ay1,by1)
    ix2=min(ax2,bx2); iy2=min(ay2,by2)
    inter=max(0,ix2-ix1)*max(0,iy2-iy1)
    aa=max(0,ax2-ax1)*max(0,ay2-ay1)
    ab=max(0,bx2-bx1)*max(0,by2-by1)
    union=aa+ab-inter
    return inter/union if union>0 else 0

model=YOLO(MODEL)

TP=FP=FN=0
images=sorted(IMG_DIR.glob("*.jpg"))

for idx,image_path in enumerate(images,1):

    img=cv2.imread(str(image_path))
    h,w=img.shape[:2]

    gt=[]
    for line in (LBL_DIR/f"{image_path.stem}.txt").read_text().splitlines():
        p=line.split()
        if len(p)!=5:
            continue

        _,xc,yc,bw,bh=map(float,p)

        xc*=w; yc*=h; bw*=w; bh*=h

        gt.append((
            xc-bw/2,
            yc-bh/2,
            xc+bw/2,
            yc+bh/2
        ))

    r=model.predict(
        source=str(image_path),
        imgsz=640,
        conf=CONF,
        iou=0.50,
        device=0,
        verbose=False
    )[0]

    preds=[]

    if r.boxes is not None:
        for box in r.boxes.xyxy.cpu().numpy():
            preds.append(tuple(box.tolist()))

    matches=[]

    for pi,pred in enumerate(preds):
        for gi,g in enumerate(gt):
            score=iou(pred,g)
            if score>=IOU_THRESHOLD:
                matches.append((score,pi,gi))

    matches.sort(reverse=True)

    matched_p=set()
    matched_g=set()

    for score,pi,gi in matches:
        if pi not in matched_p and gi not in matched_g:
            matched_p.add(pi)
            matched_g.add(gi)

    tp=len(matched_p)
    fp=len(preds)-tp
    fn=len(gt)-tp

    TP+=tp
    FP+=fp
    FN+=fn

    if idx%50==0:
        print(f"Processed {idx}/{len(images)}")

precision=TP/(TP+FP) if TP+FP else 0
recall=TP/(TP+FN) if TP+FN else 0
f1=2*precision*recall/(precision+recall) if precision+recall else 0

print("\n========== YOLO26n TUD-GV TEST ==========")
print(f"Images:    {len(images)}")
print(f"TP:        {TP}")
print(f"FP:        {FP}")
print(f"FN:        {FN}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1:        {f1:.4f}")
print("Confidence: 0.25")
print("IoU:        0.50")
