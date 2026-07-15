import time
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import ExerciseLibrary
from sqlalchemy import select

GITHUB_RAW_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
JSON_PATH = os.path.join(DATA_DIR, "exercises.json")
BATCH_SIZE = 200


def seed():
    if not os.path.exists(JSON_PATH):
        raise FileNotFoundError(f"Dataset not found: {JSON_PATH}")

    print("Loading dataset...")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        exercises = json.load(f)

    print(f"Total exercises found: {len(exercises)}")

    app = create_app()
    with app.app_context():
        imported = 0
        skipped = 0
        start = time.time()

        try:
            for record in exercises:
                ext_id = record["id"]

                existing = db.session.scalar(
                    select(ExerciseLibrary).where(
                        ExerciseLibrary.external_id == ext_id
                    )
                )

                if existing:
                    skipped += 1
                    continue

                db.session.add(ExerciseLibrary(
                    external_id=ext_id,
                    name=record["name"],
                    body_part=record["body_part"],
                    target=record["target"],
                    equipment=record["equipment"],
                    secondary_muscles=record["secondary_muscles"],
                    instructions=record["instructions"].get("en", ""),
                    image_url=f"{GITHUB_RAW_BASE}/{record['image']}",
                    gif_url=f"{GITHUB_RAW_BASE}/{record['gif_url']}",
                ))
                imported += 1

                if imported > 0 and imported % BATCH_SIZE == 0:
                    db.session.commit()
                    print(f"  Committed batch: {imported} exercises so far...")

            db.session.commit()
            elapsed = time.time() - start

            print(f"\n--- Seed completed ---")
            print(f"Imported: {imported}")
            print(f"Skipped (duplicates): {skipped}")
            print(f"Finished in {elapsed:.2f}s")

        except Exception as e:
            db.session.rollback()
            print(f"\nError: {e}")
            raise


if __name__ == "__main__":
    seed()
