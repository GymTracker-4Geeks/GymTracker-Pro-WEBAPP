from sqlalchemy import select, func

from app.models import Client, Trainer, ExerciseLibrary
from app.extensions import db

def validate_fields(data, fields):
    return data and all(k in data and data[k] for k in fields)

def validate_positive_float(data, fields):
    if not fields:
        return False
    try:
        return all(float(data[k]) > 0 for k in fields)
    except (ValueError, TypeError, KeyError):
        return False
    
def validate_positive_integers(data, fields):
    if not fields:
        return False
    try:
        return all(int(data[k]) > 0 for k in fields)
    except (ValueError, TypeError, KeyError):
        return False

def get_current_client(user_id):
    return db.session.scalar(
        select(Client).where(Client.user_id == user_id)
    )

def get_current_trainer(user_id):
    return db.session.scalar(
        select(Trainer).where(Trainer.user_id == user_id)
    )

def get_library_exercise_id(exercise_name):
    """Find the ExerciseLibrary id matching the given exercise name."""
    match = db.session.scalar(
        select(ExerciseLibrary).where(
            func.lower(ExerciseLibrary.name) == func.lower(exercise_name)
        )
    )
    return match.id if match else None