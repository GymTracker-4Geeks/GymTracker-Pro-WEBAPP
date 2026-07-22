"""Link existing Exercise records to ExerciseLibrary by matching names."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models import Exercise, ExerciseLibrary
from sqlalchemy import select, func

app = create_app()

with app.app_context():
    # Contar ejercicios sin library_exercise_id
    total = db.session.scalar(select(func.count()).select_from(Exercise))
    unlinked = db.session.scalar(
        select(func.count()).select_from(Exercise).where(Exercise.library_exercise_id == None)
    )
    print(f"Total exercises: {total}")
    print(f"Without library link: {unlinked}")
    print()

    # Obtener todos los ejercicios sin enlace
    exercises = db.session.scalars(
        select(Exercise).where(Exercise.library_exercise_id == None)
    ).all()

    updated = 0
    skipped = 0

    for ex in exercises:
        # Buscar en ExerciseLibrary por nombre (case-insensitive)
        match = db.session.scalar(
            select(ExerciseLibrary).where(
                func.lower(ExerciseLibrary.name) == func.lower(ex.name)
            )
        )

        if match:
            ex.library_exercise_id = match.id
            updated += 1
            if updated <= 5:
                print(f"  Linked: {ex.name} -> library #{match.id}")
        else:
            skipped += 1
            if skipped <= 5:
                print(f"  No match: {ex.name}")

    db.session.commit()

    print()
    print(f"Updated: {updated}")
    print(f"Skipped (no match): {skipped}")
    print(f"Linked exercises now have library_exercise_id + image_url")

    # Verify
    remaining = db.session.scalar(
        select(func.count()).select_from(Exercise).where(Exercise.library_exercise_id == None)
    )
    print(f"Still unlinked: {remaining}")
    print("Done!")
