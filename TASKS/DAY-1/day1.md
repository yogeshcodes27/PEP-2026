# TASK 1 — RESEARCH PAPERS & DATASET IDENTIFICATION

## Title
### Floating Waste Detection in Inland Waters — Literature Review & Dataset Reference

---

## 1. FloW — Base Paper

**Citation:**  
Cheng, Y. et al. (2021). *FloW: A Dataset and Benchmark for Floating Waste Detection in Inland Waters.* IEEE/CVF ICCV 2021.  
**DOI:** `10.1109/ICCV48922.2021.01077`

**Paper:**  
https://ieeexplore.ieee.org/document/9710581/

**PDF:**  
https://openaccess.thecvf.com/content/ICCV2021/papers/Cheng_FloW_A_Dataset_and_Benchmark_for_Floating_Waste_Detection_in_ICCV_2021_paper.pdf

**Dataset:**  
FloW-Img — 2,000 images, 5,271 annotated instances.

**Taken for our project:**  
Base benchmark, floating-waste detection problem, small-object challenge and USV-based imagery.

**Dataset:**  
https://github.com/ORCA-Uboat/FloW-Dataset


---

## 2. Floating Litter Detection Using Semi-Supervised Deep Learning

**Citation:**  
Jia, T. et al. (2024). *Detecting floating litter in freshwater bodies with semi-supervised deep learning.* Water Research, 266, 122405.  
**DOI:** `10.1016/j.watres.2024.122405`

**Paper:**  
https://doi.org/10.1016/j.watres.2024.122405

**Datasets:**  
TUD-GV, Oostpoort, Amsterdam, Groningen, Ho Chi Minh City.

**Taken for our project:**  
Cross-location evaluation, semi-supervised learning and domain-generalization idea.


---

## 3. IWHR Floating-Debris Dataset

**Citation:**  
Qiao, G., Yang, M., & Wang, H. (2025). *An annotated Dataset and Benchmark for Detecting Floating Debris in Inland Waters.* Scientific Data, 12, 385.  
**DOI:** `10.1038/s41597-025-04594-9`

**Paper:**  
https://doi.org/10.1038/s41597-025-04594-9

**Dataset:**  
IWHR_AI_Lable_Floater_V1 — 3,000 images, 23,692 annotated objects.

**Taken for our project:**  
Independent external dataset and evaluation of small floating debris under different visual conditions.

**Dataset:**  
https://doi.org/10.6084/m9.figshare.27376851.v1


---

## 4. Floating-Waste Detection Using Feature Fusion

**Citation:**  
Li, Y. et al. (2023). *A Floating-Waste-Detection Method for Unmanned Surface Vehicle Based on Feature Fusion and Enhancement.* Journal of Marine Science and Engineering.  
**DOI:** `10.3390/jmse11122234`

**Paper:**  
https://doi.org/10.3390/jmse11122234

**Datasets:**  
FloW-Img, FloatingWaste-I.

**Taken for our project:**  
Floating-waste detection methods, feature enhancement and additional USV floating-waste data.


---

## 5. Water Surface Object Detection

**Citation:**  
Zhou, Z. et al. (2021). *An Image-Based Benchmark Dataset and a Novel Object Detector for Water Surface Object Detection.* Frontiers in Neurorobotics.  
**DOI:** `10.3389/fnbot.2021.723336`

**Paper:**  
https://doi.org/10.3389/fnbot.2021.723336

**Dataset:**  
WSODD — 7,467 images, 21,911 instances.

**Taken for our project:**  
Water-surface conditions, environmental variation and small-object detection context.


---

## 6. EA-DETR

**Citation:**  
Wang, J. & Liu, X. (2025). *EA-DETR: Edge-Aware Detection Transformer for Water Surface Floating Object Identification.* Neural Processing Letters.  
**DOI:** `10.1007/s11063-025-11769-3`

**Paper:**  
https://doi.org/10.1007/s11063-025-11769-3

**Datasets:**  
FloW-Img, Trash-ICRA19.

**Taken for our project:**  
Floating-object detection and cross-dataset robustness.


---

## 7. Floating Plastic Detection Using Sentinel-2

**Citation:**  
Cerra, D. et al. (2025). *Detection and Monitoring of Floating Plastic Debris on Inland Waters From Sentinel-2 Time Series.* IEEE JSTARS.  
**DOI:** `10.1109/JSTARS.2024.3502796`

**Paper:**  
https://ieeexplore.ieee.org/document/10758695

**Data:**  
Sentinel-2 satellite imagery.

**Taken for our project:**  
Large-scale floating-plastic monitoring as a related remote-sensing approach.


---

## 8. Autonomous Aerial Monitoring

**Citation:**  
Moreno, M. et al. (2025). *Autonomous Aerial Monitoring Framework for Floating Waste Detection and Geolocation.* IEEE OCEANS 2025.  
**DOI:** `10.23919/OCEANS59106.2025.11244978`

**Paper:**  
https://doi.org/10.23919/OCEANS59106.2025.11244978

**Data:**  
Public + custom UAV data.

**Taken for our project:**  
UAV deployment, YOLO-based detection and geolocation concept.


---

## 9. FLD-Net / UAV-Flow

**Citation:**  
Wang, X. et al. (2026). *FLD-Net for Floating Litter Detection in UAV Remote Sensing.* Remote Sensing.  
**DOI:** `10.3390/rs18050736`

**Paper:**  
https://doi.org/10.3390/rs18050736

**Dataset:**  
UAV-Flow — 4,593 images, 20,618 annotated instances.

**Taken for our project:**  
Recent UAV-based floating-litter research and small-object detection.

**Dataset / Code:**  
https://github.com/starandmoonw/FLD-Net


---

## 10. Recent FloW Model Comparison

**Citation:**  
Sumon, S. I. et al. (2026). *Floating waste detection using deep learning: a comparative study of YOLO, RT-DETR, and Faster R-CNN.* Neural Computing and Applications.  
**DOI:** `10.1007/s00521-026-12051-w`

**Paper:**  
https://doi.org/10.1007/s00521-026-12051-w

**Dataset:**  
FloW-Img.

**Taken for our project:**  
Current FloW research landscape and existing YOLO/RT-DETR/Faster R-CNN comparisons.


---

# DATA WE WILL USE

### Primary Dataset
**FloW-Img**  
2,000 images / 5,271 instances  
https://github.com/ORCA-Uboat/FloW-Dataset

### External Validation Dataset
**TUD-GV Object Detection**  
1,501 images / 8,181 boxes  
https://doi.org/10.5281/zenodo.13730228

### Second External Validation Dataset
**IWHR**  
3,000 images / 23,692 objects  
https://doi.org/10.6084/m9.figshare.27376851.v1

### Optional
**Oostpoort** — 562 / 1,014  
https://doi.org/10.5281/zenodo.13730298

**Groningen** — 63 / 383  
https://doi.org/10.5281/zenodo.13730384


---

# DATA TO DOWNLOAD

**1. TUD-GV OD**  
https://doi.org/10.5281/zenodo.13730228

**2. IWHR**  
https://doi.org/10.6084/m9.figshare.27376851.v1

**3. FloW-Img**  
https://github.com/ORCA-Uboat/FloW-Dataset  
→ Official access/request required.

**Do not download Oostpoort and Groningen yet.**
