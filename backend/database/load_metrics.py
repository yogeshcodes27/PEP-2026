from pathlib import Path
import duckdb
BACKEND_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BACKEND_DIR / "data" / "detections.duckdb"

ROWS = [
    ("YOLOv8s-640", "TUD-GV", "test", 256, 1506, 0.9240, 0.9442, 0.9340, 0.9710, 0.7490, 0.40, 9.30, "custom_threshold_evaluation", "baseline_640"),
    ("YOLOv8s-960", "TUD-GV", "test", 256, 1506, 0.9163, 0.9456, 0.9307, 0.9730, 0.7640, 0.50, 16.73, "custom_threshold_evaluation", "highres_960"),
    ("YOLO26n", "TUD-GV", "test", 256, 1506, 0.8997, 0.9469, 0.9227, 0.9650, 0.7320, 0.25, 2.90, "custom_threshold_evaluation", "yolo26n_640"),
    ("YOLO26n-IWHR-Adapted", "IWHR", "test", 450, 3660, 0.8510, 0.7010, 2 * 0.8510 * 0.7010 / (0.8510 + 0.7010), 0.7390, 0.5240, 0.25, 3.41, "official_test_evaluation", "yolo26n_iwhr_finetune-3"),
    ("YOLO26s-P2-Unified", "TUD-GV", "test", 256, 1506, 0.9732, 0.9037, 0.9372, 0.9360, 0.7199, 0.25, 10.2, "final_held_out_evaluation", "yolo26s_p2_unified"),
    ("YOLO26s-P2-Unified", "IWHR", "test", 450, 3660, 0.8661, 0.6876, 0.7666, 0.7348, 0.5178, 0.25, 10.6, "final_held_out_evaluation", "yolo26s_p2_unified"),
    ("YOLO26s-P2-TUD-4200", "TUD-GV", "test", 256, 1506, 0.9602, 0.9250, 0.9423, 0.9287, 0.7237, 0.25, 10.2, "compute_matched_control", "yolo26s_p2_tud_4200"),
    ("YOLO26s-P2-TUD-4200", "IWHR", "test", 450, 3660, 0.3140, 0.1568, 0.2092, 0.0739, 0.0370, 0.25, 10.6, "compute_matched_control", "yolo26s_p2_tud_4200"),
]

def main():
    conn = duckdb.connect(str(DB_PATH))

    conn.execute("DELETE FROM model_metrics")

    conn.executemany(
        """
        INSERT INTO model_metrics
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        ROWS
    )

    print("\n" + "=" * 60)
    print("ROBUSTFLOAT | MODEL METRICS LOADED")
    print("=" * 60)

    result = conn.execute("""
        SELECT
            model_name,
            evaluation_dataset,
            evaluation_split,
            precision,
            recall,
            f1,
            map50,
            map50_95,
            evaluation_protocol
        FROM model_metrics
        ORDER BY model_name, evaluation_dataset
    """).fetchdf()

    print(result.to_string(index=False))

    conn.close()

if __name__ == "__main__":
    main()

