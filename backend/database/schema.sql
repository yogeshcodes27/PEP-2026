CREATE TABLE IF NOT EXISTS images (
    image_id VARCHAR PRIMARY KEY,
    file_name VARCHAR NOT NULL,
    source_path VARCHAR,
    source_type VARCHAR,
    width INTEGER,
    height INTEGER,
    image_hash VARCHAR,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS runs (
    run_id VARCHAR PRIMARY KEY,
    image_id VARCHAR,
    model_name VARCHAR,
    model_version VARCHAR,
    model_hash VARCHAR,
    confidence_threshold DOUBLE,
    imgsz INTEGER,
    inference_ms DOUBLE,
    detected_count INTEGER,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detections (
    detection_id VARCHAR PRIMARY KEY,
    run_id VARCHAR,
    class_name VARCHAR,
    confidence DOUBLE,
    x1 DOUBLE,
    y1 DOUBLE,
    x2 DOUBLE,
    y2 DOUBLE,
    box_width DOUBLE,
    box_height DOUBLE,
    box_area_ratio DOUBLE,
    center_x DOUBLE,
    center_y DOUBLE
);

CREATE TABLE IF NOT EXISTS model_metrics (
    model_name VARCHAR,
    evaluation_dataset VARCHAR,
    evaluation_split VARCHAR,
    images INTEGER,
    instances INTEGER,
    precision DOUBLE,
    recall DOUBLE,
    f1 DOUBLE,
    map50 DOUBLE,
    map50_95 DOUBLE,
    confidence_threshold DOUBLE,
    inference_ms DOUBLE,
    evaluation_protocol VARCHAR,
    source_run VARCHAR
);

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id VARCHAR PRIMARY KEY,
    run_id VARCHAR,
    detection_id VARCHAR,
    action VARCHAR,
    bbox_x1 DOUBLE,
    bbox_y1 DOUBLE,
    bbox_x2 DOUBLE,
    bbox_y2 DOUBLE,
    note VARCHAR,
    session_id VARCHAR,
    reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);