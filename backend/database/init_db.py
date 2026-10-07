from pathlib import Path
import duckdb


BACKEND_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BACKEND_DIR / "data" / "detections.duckdb"
SCHEMA_PATH = BACKEND_DIR / "database" / "schema.sql"


def main():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    conn = duckdb.connect(str(DB_PATH))

    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.execute(schema)

    print("\n" + "=" * 60)
    print("ROBUSTFLOAT | DATABASE INITIALIZED")
    print("=" * 60)
    print(f"Database: {DB_PATH}")

    tables = conn.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'main'
        ORDER BY table_name
    """).fetchall()

    print("\nTables:")
    for (table,) in tables:
        print(f"  ✓ {table}")

    conn.close()


if __name__ == "__main__":
    main()