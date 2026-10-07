import os
import uuid

from io import BytesIO
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

import torch
from ultralytics import YOLO

from backend.rag.context_builder import build_context, retrieve_knowledge
from backend.llm.llm import generate_answer


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DETECTOR_PATH = BASE_DIR / "backend" / "models" / "best.pt"

CLASSIFIER_PATH = (
    BASE_DIR
    / "research"
    / "runs"
    / "classify"
    / "train"
    / "weights"
    / "best.pt"
)


# ============================================================
# FASTAPI APP & CORS
# ============================================================

app = FastAPI(
    title="RobustFloat API",
    description="Cross-domain floating-waste detection API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IN-MEMORY RUN CACHE
# ============================================================

RUNS_CACHE: Dict[str, Dict[str, Any]] = {}


# ============================================================
# LOAD MODELS
# ============================================================

# Primary floating-waste detector
detector = YOLO(str(DETECTOR_PATH))


# Auxiliary waste-type classifier
classifier = None

if CLASSIFIER_PATH.exists():
    try:
        classifier = YOLO(str(CLASSIFIER_PATH))
        print(f"Loaded classifier from: {CLASSIFIER_PATH}")
    except Exception as e:
        print(
            f"Warning: Failed to load classifier from "
            f"{CLASSIFIER_PATH}: {e}"
        )


# ============================================================
# HEALTH ENDPOINT
# ============================================================

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "detector": (
            "YOLO26s-P2-Unified"
            if DETECTOR_PATH.exists()
            else "unavailable"
        ),
        "detector_class": "floating_waste",
        "classifier": (
            "MARINE-DEBRIS640"
            if classifier is not None
            else "unavailable"
        ),
        "classifier_classes": (
            classifier.names
            if classifier is not None
            else []
        ),
        "rag": (
            "enabled"
            if (
                BASE_DIR
                / "backend"
                / "rag_index"
                / "index.faiss"
            ).exists()
            else "unavailable"
        ),
        "llm": (
            "Groq"
            if bool(os.getenv("GROQ_API_KEY"))
            else "unavailable"
        ),
    }


# ============================================================
# RUN RETRIEVAL ENDPOINT
# ============================================================

@app.get("/api/runs/{run_id}")
def get_run(run_id: str):

    if run_id not in RUNS_CACHE:
        raise HTTPException(
            status_code=404,
            detail=f"Run '{run_id}' not found.",
        )

    return RUNS_CACHE[run_id]


# ============================================================
# PREDICT ENDPOINT
# ============================================================

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):

    # --------------------------------------------------------
    # Validate file
    # --------------------------------------------------------

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image files are supported.",
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    # --------------------------------------------------------
    # Convert uploaded bytes to PIL image
    # --------------------------------------------------------

    try:
        image = Image.open(
            BytesIO(image_bytes)
        ).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    # --------------------------------------------------------
    # PRIMARY DETECTOR
    # --------------------------------------------------------

    device = 0 if torch.cuda.is_available() else "cpu"

    try:
        detection_results = detector.predict(
            source=image,
            imgsz=640,
            conf=0.05,
            device=device,
            verbose=False,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Detector inference failed: {str(e)}",
        )

    result = detection_results[0]

    inference_ms = (
        round(
            float(
                result.speed.get(
                    "inference",
                    10.2,
                )
            ),
            1,
        )
        if hasattr(result, "speed")
        else 10.2
    )

    image_width = result.orig_shape[1]
    image_height = result.orig_shape[0]

    detections = []

    # ========================================================
    # PROCESS DETECTIONS
    # ========================================================

    for detection_index, box in enumerate(
        result.boxes,
        start=1,
    ):

        class_id = int(
            box.cls[0].item()
        )

        detector_confidence = float(
            box.conf[0].item()
        )

        xyxy = box.xyxy[0].tolist()

        # ----------------------------------------------------
        # Bounding box pixel coordinates
        # ----------------------------------------------------

        x1 = max(
            0,
            min(
                int(xyxy[0]),
                image_width - 1,
            ),
        )

        y1 = max(
            0,
            min(
                int(xyxy[1]),
                image_height - 1,
            ),
        )

        x2 = max(
            0,
            min(
                int(xyxy[2]),
                image_width,
            ),
        )

        y2 = max(
            0,
            min(
                int(xyxy[3]),
                image_height,
            ),
        )

        # ----------------------------------------------------
        # Normalized coordinates (0..1)
        # ----------------------------------------------------

        norm_x1 = max(
            0.0,
            min(
                1.0,
                round(
                    x1 / image_width,
                    4,
                ),
            ),
        )

        norm_y1 = max(
            0.0,
            min(
                1.0,
                round(
                    y1 / image_height,
                    4,
                ),
            ),
        )

        norm_x2 = max(
            0.0,
            min(
                1.0,
                round(
                    x2 / image_width,
                    4,
                ),
            ),
        )

        norm_y2 = max(
            0.0,
            min(
                1.0,
                round(
                    y2 / image_height,
                    4,
                ),
            ),
        )

        # ----------------------------------------------------
        # Crop detection for auxiliary classifier
        # ----------------------------------------------------

        crop = image.crop(
            (
                x1,
                y1,
                x2,
                y2,
            )
        )

        type_prediction = None

        # ----------------------------------------------------
        # AUXILIARY TYPE CLASSIFICATION
        # ----------------------------------------------------

        if (
            classifier is not None
            and crop.width > 1
            and crop.height > 1
        ):

            try:

                classification_results = classifier.predict(
                    source=crop,
                    imgsz=224,
                    device=device,
                    verbose=False,
                )

                classification_result = (
                    classification_results[0]
                )

                if classification_result.probs is not None:

                    type_class_id = int(
                        classification_result.probs.top1
                    )

                    type_confidence = float(
                        classification_result
                        .probs
                        .top1conf
                        .item()
                    )

                    type_label = (
                        classification_result.names[
                            type_class_id
                        ]
                    )

                    type_prediction = {
                        "class_id": type_class_id,
                        "class_name": type_label,
                        "confidence": round(
                            type_confidence,
                            4,
                        ),
                    }

            except Exception as e:

                type_prediction = {
                    "error": (
                        "Type classification failed: "
                        f"{str(e)}"
                    )
                }

        # ----------------------------------------------------
        # STORE DETECTION
        # ----------------------------------------------------

        detections.append(
            {
                "detection_id": detection_index,

                "class_id": class_id,

                "class_name": result.names[class_id],

                "confidence": round(
                    detector_confidence,
                    4,
                ),

                "bbox": {
                    "x1": norm_x1,
                    "y1": norm_y1,
                    "x2": norm_x2,
                    "y2": norm_y2,
                },

                "pixel_bbox": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2,
                },

                # Auxiliary classifier result
                "type_prediction": type_prediction,
            }
        )

    # ========================================================
    # RAG CONTEXT & INITIAL ANALYSIS
    # ========================================================

    # Count visible detections at standard threshold 0.25
    visible_detections = [
        d
        for d in detections
        if d["confidence"] >= 0.25
    ]

    visible_count = len(
        visible_detections
    )

    total_count = len(detections)

    # --------------------------------------------------------
    # Build type summary
    # --------------------------------------------------------

    type_summary = {}

    for detection in detections:

        prediction = detection.get(
            "type_prediction"
        )

        if (
            not prediction
            or "class_name" not in prediction
        ):
            continue

        label = prediction["class_name"]

        type_summary[label] = (
            type_summary.get(label, 0) + 1
        )

    # --------------------------------------------------------
    # Initial analysis question
    # --------------------------------------------------------

    question = (
        "Analyze this RobustFloat image detection. "
        f"The model detected {visible_count} "
        "visible floating_waste objects at "
        "threshold 0.25 "
        f"({total_count} candidate regions overall)."
    )

    # --------------------------------------------------------
    # Add classifier summary
    # --------------------------------------------------------

    if type_summary:

        summary_text = ", ".join(
            f"{count} {label}"
            for label, count in type_summary.items()
        )

        question += (
            " The auxiliary waste-type classifier "
            "predicted the following categories: "
            f"{summary_text}."
        )

    try:

        context = build_context(
            question
        )

        # IMPORTANT:
        # Add actual image detection and classifier
        # predictions directly to the LLM context.
        context += (
            "\n\n"
            "CURRENT IMAGE DETECTION RESULTS:\n"
        )

        context += (
            f"Visible floating-waste detections: "
            f"{visible_count}\n"
        )

        context += (
            "The auxiliary MARINE-DEBRIS640 "
            "classifier provides category predictions "
            "for detected regions. These are predictions, "
            "not guaranteed ground truth.\n"
        )

        for detection in visible_detections:

            prediction = detection.get(
                "type_prediction"
            ) or {}

            detection_id = detection.get(
                "detection_id"
            )

            detector_confidence = detection.get(
                "confidence",
                0.0,
            )

            type_label = prediction.get(
                "class_name"
            )

            type_confidence = prediction.get(
                "confidence"
            )

            if type_label:

                context += (
                    f"- Box #{detection_id}: "
                    f"classified as {type_label}"
                )

                if type_confidence is not None:
                    context += (
                        f" "
                        f"(type confidence: "
                        f"{type_confidence:.2f})"
                    )

                context += (
                    f"; detector confidence: "
                    f"{detector_confidence:.2f}\n"
                )

            else:

                context += (
                    f"- Box #{detection_id}: "
                    "floating_waste; "
                    f"detector confidence: "
                    f"{detector_confidence:.2f}; "
                    "no type prediction available.\n"
                )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "RAG context generation failed: "
                f"{str(e)}"
            ),
        )

    # ========================================================
    # GROQ LLM INITIAL INTERPRETATION
    # ========================================================

    try:

        llm_result = generate_answer(
            question,
            context,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "LLM generation failed: "
                f"{str(e)}"
            ),
        )

    # ========================================================
    # CREATE RUN
    # ========================================================

    run_id = (
        f"run_{uuid.uuid4().hex[:12]}"
    )

    response_data = {

        "run_id": run_id,

        "filename": file.filename,

        "model": "YOLO26s-P2-Unified",

        "inference_ms": inference_ms,

        "image_size": {
            "width": image_width,
            "height": image_height,
        },

        "detection_count": visible_count,

        "total_candidates": total_count,

        # Full detection information,
        # including classifier predictions
        "detections": detections,

        # Type classifier metadata
        "type_classifier": {

            "model": (
                "MARINE-DEBRIS640"
                if classifier is not None
                else "unavailable"
            ),

            "classes": (
                classifier.names
                if classifier is not None
                else []
            ),

            "role": "auxiliary",

            "summary": type_summary,
        },

        "analysis": {

            "answer": llm_result["answer"],

            "model": llm_result["model"],

            "input_tokens": (
                llm_result["input_tokens"]
            ),

            "output_tokens": (
                llm_result["output_tokens"]
            ),

            "total_tokens": (
                llm_result["total_tokens"]
            ),
        },
    }

    # Store for later chat/RAG requests
    RUNS_CACHE[run_id] = response_data

    return response_data


# ============================================================
# CHAT ENDPOINT (RAG + GROQ LLM)
# ============================================================

class AskRequest(BaseModel):

    question: str

    run_id: Optional[str] = None


@app.post("/api/ask")
async def ask(req: AskRequest):

    question_text = req.question.strip()

    if not question_text:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    # --------------------------------------------------------
    # Retrieve current image run
    # --------------------------------------------------------

    run_data = (
        RUNS_CACHE.get(req.run_id)
        if req.run_id
        else None
    )

    # ========================================================
    # CURRENT IMAGE GROUNDING
    # ========================================================

    if run_data:

        detections = run_data.get(
            "detections",
            [],
        )

        visible = [
            d
            for d in detections
            if d.get(
                "confidence",
                0,
            ) >= 0.25
        ]

        detections_desc = (
            "<current_image>\n"
            f"Image filename: "
            f"{run_data.get('filename')}\n"
            f"Model: "
            f"{run_data.get('model', 'YOLO26s-P2-Unified')}\n"
            f"Visible floating_waste detections "
            f"(threshold >= 0.25): "
            f"{len(visible)}\n"
            f"Total candidate boxes detected: "
            f"{len(detections)}\n"
            "\n"
            "IMPORTANT: The following type labels are "
            "predictions from the auxiliary "
            "MARINE-DEBRIS640 classifier. They should "
            "be described as classifications/predictions, "
            "not absolute ground truth.\n"
        )

        # ----------------------------------------------------
        # Add every visible detection and type prediction
        # ----------------------------------------------------

        for d in visible[:20]:

            detection_id = d.get(
                "detection_id"
            )

            detector_class = d.get(
                "class_name",
                "floating_waste",
            )

            detector_confidence = d.get(
                "confidence",
                0.0,
            )

            t_pred = (
                d.get("type_prediction")
                or {}
            )

            type_name = t_pred.get(
                "class_name"
            )

            type_confidence = t_pred.get(
                "confidence"
            )

            if type_name:

                detections_desc += (
                    f"- Box #{detection_id}: "
                    f"detected as {detector_class}; "
                    f"classified as {type_name}; "
                    f"detector confidence "
                    f"{detector_confidence:.2f}"
                )

                if type_confidence is not None:

                    detections_desc += (
                        f"; type-classifier confidence "
                        f"{type_confidence:.2f}"
                    )

                detections_desc += "\n"

            else:

                detections_desc += (
                    f"- Box #{detection_id}: "
                    f"detected as {detector_class}; "
                    f"no auxiliary type prediction "
                    f"available; detector confidence "
                    f"{detector_confidence:.2f}\n"
                )

        detections_desc += (
            "</current_image>\n"
        )

        # ----------------------------------------------------
        # Explicit instruction for current-image questions
        # ----------------------------------------------------

        augmented_question = (
            f"{detections_desc}\n"
            "<instruction>\n"
            "When answering questions about the type of "
            "waste in the current image, use the "
            "classification predictions inside "
            "<current_image>. Do not claim that the "
            "system has no type-classification capability "
            "when a type prediction is provided. "
            "Describe them as auxiliary classifier "
            "predictions, not guaranteed ground truth.\n"
            "</instruction>\n"
            f"<question>\n"
            f"{question_text}\n"
            f"</question>"
        )

    else:

        augmented_question = (
            "<question>\n"
            f"{question_text}\n"
            "</question>"
        )

    # ========================================================
    # RETRIEVE SOURCES FROM FAISS
    # ========================================================

    try:

        retrieved_chunks = retrieve_knowledge(
            question_text,
            top_k=3,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Knowledge retrieval failed: "
                f"{str(e)}"
            ),
        )

    sources = [
        {
            "name": chunk["source"],
            "chunkId": chunk["chunk_id"],
        }
        for chunk in retrieved_chunks
    ]

    # ========================================================
    # BUILD RAG CONTEXT
    # ========================================================

    try:

        context = build_context(
            question_text
        )

        # ----------------------------------------------------
        # Add current image information to RAG context
        # ----------------------------------------------------

        if run_data:

            context += (
                "\n\n"
                "CURRENT IMAGE DETECTION RESULTS:\n"
            )

            context += detections_desc

            context += (
                "\n"
                "Use these current-image detection and "
                "classification results when the user's "
                "question refers to the uploaded image. "
                "The classifier labels are predictions and "
                "should not be presented as certain "
                "material identities.\n"
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Context retrieval failed: "
                f"{str(e)}"
            ),
        )

    # ========================================================
    # GENERATE ANSWER WITH GROQ LLM
    # ========================================================

    try:

        llm_result = generate_answer(
            augmented_question,
            context,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Answer generation failed: "
                f"{str(e)}"
            ),
        )

    answer_text = llm_result["answer"]

    # ========================================================
    # EVIDENCE / FACTS SUMMARY
    # ========================================================

    facts = {

        "modelVersion": (
            "YOLO26s-P2-Unified"
        ),

        "targetClass": (
            "floating_waste"
        ),

        "detectionCount": (
            len(
                [
                    d
                    for d in (
                        run_data.get(
                            "detections",
                            [],
                        )
                        if run_data
                        else []
                    )
                    if d.get(
                        "confidence",
                        0,
                    ) >= 0.25
                ]
            )
        ),
    }

    # Add type summary to evidence
    if run_data:

        type_classifier_data = (
            run_data.get(
                "type_classifier",
                {},
            )
        )

        type_summary = (
            type_classifier_data.get(
                "summary",
                {},
            )
        )

        if type_summary:

            facts["typeClassification"] = (
                type_summary
            )

    if (
        run_data
        and "inference_ms" in run_data
    ):

        facts["inferenceMs"] = (
            f"{run_data['inference_ms']} ms"
        )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "answer": answer_text,

        "refusal": False,

        "evidence": {

            "facts": facts,

            "sources": sources,
        },
    }