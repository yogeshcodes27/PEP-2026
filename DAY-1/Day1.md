# Floating-Waste Detection — Research References

## Base Paper

### 1. FloW — Base Research Paper

**Citation**  
Cheng, Y. et al. (2021). *FloW: A Dataset and Benchmark for Floating Waste Detection in Inland Waters.* IEEE/CVF ICCV 2021.  
DOI: `10.1109/ICCV48922.2021.01077`

**Paper**
- IEEE Xplore: https://ieeexplore.ieee.org/document/9710581/
- Open PDF: https://openaccess.thecvf.com/content/ICCV2021/papers/Cheng_FloW_A_Dataset_and_Benchmark_for_Floating_Waste_Detection_in_ICCV_2021_paper.pdf

**Datasets Used / Introduced**
- FloW-Img
- FloW-RI
- FloW-Img: 2,000 images / 5,271 annotated floating-waste instances

**Taken from the Paper**
- Base floating-waste detection problem
- Small-object detection challenge
- USV-based data acquisition
- RGB detection benchmark
- Water reflections and complex background challenges

**Official Dataset**
- https://github.com/ORCA-Uboat/FloW-Dataset


---

## Research Papers

### 2. Semi-Supervised Floating-Litter Detection

**Citation**  
Jia, T., de Vries, R., Kapelan, Z., van Emmerik, T. H. M., & Taormina, R. (2024). *Detecting floating litter in freshwater bodies with semi-supervised deep learning.* Water Research, 266, 122405.  
DOI: `10.1016/j.watres.2024.122405`

**Paper**
- https://doi.org/10.1016/j.watres.2024.122405
- PDF: https://repository.tudelft.nl/file/File_6d93922b-04ad-4f00-bac8-ba3e440aacd5

**Datasets Used**
- TUD-GV
- Oostpoort
- Amsterdam
- Groningen
- Ho Chi Minh City

**Taken from the Paper**
- Semi-supervised learning
- Unseen-location evaluation
- Cross-domain generalization
- Multi-location freshwater litter detection


### 3. IWHR Floating-Debris Benchmark

**Citation**  
Qiao, G., Yang, M., & Wang, H. (2025). *An annotated Dataset and Benchmark for Detecting Floating Debris in Inland Waters.* Scientific Data, 12, 385.  
DOI: `10.1038/s41597-025-04594-9`

**Paper**
- https://doi.org/10.1038/s41597-025-04594-9
- PDF: https://www.nature.com/articles/s41597-025-04594-9.pdf

**Dataset Used / Introduced**
- IWHR_AI_Lable_Floater_V1
- 3,000 images
- 23,692 annotated floating objects
- JPG images + XML annotations

**Taken from the Paper**
- Independent inland-water benchmark
- Small-object detection challenge
- Complex illumination/reflection conditions
- Dataset provenance and annotation structure

**Dataset**
- https://doi.org/10.6084/m9.figshare.27376851.v1


### 4. YOLO-Float / FloatingWaste-I

**Citation**  
Li, Y., Wang, R., Gao, D., & Liu, Z. (2023). *A Floating-Waste-Detection Method for Unmanned Surface Vehicle Based on Feature Fusion and Enhancement.* Journal of Marine Science and Engineering, 11(12), 2234.  
DOI: `10.3390/jmse11122234`

**Paper**
- https://doi.org/10.3390/jmse11122234
- PDF: https://www.mdpi.com/2077-1312/11/12/2234/pdf

**Datasets Used**
- FloW-Img
- FloatingWaste-I

**FloatingWaste-I**
- 1,867 images
- Bottles and cartons
- Multiple lighting conditions

**Taken from the Paper**
- Feature enhancement
- Feature fusion
- USV floating-waste detection
- Small-object/reflection challenges
- FloatingWaste-I dataset

**Dataset / Code**
- https://github.com/wangruichen01/FloatingWaste-I


### 5. WSODD — Water Surface Object Detection

**Citation**  
Zhou, Z. et al. (2021). *An Image-Based Benchmark Dataset and a Novel Object Detector for Water Surface Object Detection.* Frontiers in Neurorobotics, 15, 723336.  
DOI: `10.3389/fnbot.2021.723336`

**Paper**
- https://doi.org/10.3389/fnbot.2021.723336
- PDF: https://www.frontiersin.org/journals/neurorobotics/articles/10.3389/fnbot.2021.723336/pdf

**Dataset Used / Introduced**
- WSODD
- 7,467 images
- 21,911 instances
- 14 categories
- Rivers, lakes and oceans
- Multiple weather and lighting conditions

**Taken from the Paper**
- Water-surface dataset diversity
- Weather/lighting variation
- Small-object analysis
- Water-surface detection context

**Dataset / Code**
- https://github.com/sunjiaen/WSODD


### 6. EA-DETR — Water-Surface Floating Objects

**Citation**  
Wang, J., & Liu, X. (2025). *EA-DETR: Edge-Aware Detection Transformer for Water Surface Floating Object Identification.* Neural Processing Letters, 57, 62.  
DOI: `10.1007/s11063-025-11769-3`

**Paper**
- https://doi.org/10.1007/s11063-025-11769-3

**Datasets Used**
- FloW-Img
- Trash-ICRA19

**Taken from the Paper**
- Edge-aware detection
- Floating-object detection
- Difficult water-surface backgrounds
- Cross-dataset robustness


### 7. Floating Plastic Monitoring with Sentinel-2

**Citation**  
Cerra, D., Auer, S., Baissero Garcia, A., & Bachofer, F. (2025). *Detection and Monitoring of Floating Plastic Debris on Inland Waters From Sentinel-2 Time Series.* IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing.  
DOI: `10.1109/JSTARS.2024.3502796`

**Paper**
- IEEE: https://ieeexplore.ieee.org/document/10758695
- Institutional record: https://elib.dlr.de/208902/

**Dataset / Data Used**
- Sentinel-2 optical satellite time series

**Taken from the Paper**
- Large-scale floating-plastic monitoring
- Temporal and spectral information
- Remote-sensing-based monitoring
- Complementary approach to object-level RGB detection


### 8. Autonomous Aerial Monitoring

**Citation**  
Moreno, M. et al. (2025). *Autonomous Aerial Monitoring Framework for Floating Waste Detection and Geolocation.* OCEANS 2025 – Great Lakes, IEEE.  
DOI: `10.23919/OCEANS59106.2025.11244978`

**Paper**
- https://doi.org/10.23919/OCEANS59106.2025.11244978

**Data Used**
- Public and custom UAV data
- UAV video

**Taken from the Paper**
- UAV-based detection
- YOLOv8 inference
- GPS/IMU integration
- Geolocation
- Real-time deployment architecture


### 9. FLD-Net / UAV-Flow

**Citation**  
Wang, X. et al. (2026). *FLD-Net for Floating Litter Detection in UAV Remote Sensing.* Remote Sensing, 18(5), 736.  
DOI: `10.3390/rs18050736`

**Paper**
- https://doi.org/10.3390/rs18050736
- PDF: https://www.mdpi.com/2072-4292/18/5/736/pdf

**Dataset Used / Introduced**
- UAV-Flow
- 4,593 high-resolution images
- 20,618 annotated instances
- Urban rivers
- Natural lakes
- Nearshore mudflats

**Taken from the Paper**
- UAV floating-litter detection
- Small-object detection
- Multiple water environments
- Current UAV-specific research direction

**Dataset / Code**
- https://github.com/starandmoonw/FLD-Net


### 10. Recent FloW Model Comparison

**Citation**  
Sumon, S. I. et al. (2026). *Floating waste detection using deep learning: a comparative study of YOLO, RT-DETR, and Faster R-CNN.* Neural Computing and Applications, 38, 293.  
DOI: `10.1007/s00521-026-12051-w`

**Paper**
- https://doi.org/10.1007/s00521-026-12051-w
- PDF: https://link.springer.com/content/pdf/10.1007/s00521-026-12051-w.pdf

**Dataset Used**
- FloW-Img
- 2,000 images
- 5,271 labeled floating-waste instances

**Models Studied**
- YOLOv8
- YOLOv9
- YOLOv10
- RT-DETR
- Faster R-CNN
- Ensemble methods

**Taken from the Paper**
- Current FloW benchmark context
- Existing YOLO/RT-DETR/Faster R-CNN comparisons
- Existing ensemble-based approaches
- Evidence that a simple “compare YOLO models on FloW” study is already well explored


---

# Dataset References

| Dataset | Official / Primary Link | Verified Data |
|---|---|---|
| **FloW-Img** | https://github.com/ORCA-Uboat/FloW-Dataset | 2,000 images / 5,271 instances |
| **TUD-GV OD** | https://doi.org/10.5281/zenodo.13730228 | 1,501 images / 8,181 boxes |
| **Oostpoort** | https://doi.org/10.5281/zenodo.13730298 | 562 images / 1,014 boxes |
| **Groningen** | https://doi.org/10.5281/zenodo.13730384 | 63 images / 383 boxes |
| **IWHR** | https://doi.org/10.6084/m9.figshare.27376851.v1 | 3,000 images / 23,692 objects |
| **FloatingWaste-I** | https://github.com/wangruichen01/FloatingWaste-I | 1,867 images |
| **WSODD** | https://github.com/sunjiaen/WSODD | 7,467 images / 21,911 instances |
| **UAV-Flow** | https://github.com/starandmoonw/FLD-Net | 4,593 images / 20,618 instances |

---

## Reference Flow

**FloW (2021)**  
→ Base benchmark and floating-waste detection problem

**Jia et al. (2024)**  
→ Semi-supervised learning and cross-location generalization

**Qiao et al. (2025)**  
→ Independent inland-water floating-debris benchmark

**YOLO-Float (2023)**  
→ USV floating-waste detection and feature enhancement

**WSODD (2021)**  
→ Diverse water-surface conditions

**EA-DETR (2025)**  
→ Edge-aware and cross-dataset detection

**Sentinel-2 (2025)**  
→ Large-scale remote-sensing monitoring

**OCEANS 2025**  
→ UAV deployment and geolocation

**FLD-Net (2026)**  
→ UAV-specific floating-litter detection

**FloW comparison (2026)**  
→ Existing detector-comparison landscape
