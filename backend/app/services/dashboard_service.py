from sqlalchemy.orm import joinedload
from sqlalchemy import select
from datetime import datetime, time, timezone

from app.models import ClientRoutine, WorkoutLog, Routine
from app.extensions import db

def get_today_routine(client_id):
    today = datetime.now(timezone.utc).strftime("%A")
    
    client_routine = db.session.scalar(
        select(ClientRoutine)
        .where(ClientRoutine.client_id == client_id, ClientRoutine.week_day == today)
        .options(joinedload(ClientRoutine.routine).joinedload(Routine.exercises))
    ) 

    if not client_routine:
        return None

    return client_routine.routine

def get_today_logs(client_id):
    today = datetime.now(timezone.utc).date()

    start_day = datetime.combine(today, time.min, tzinfo=timezone.utc)
    end_day = datetime.combine(today, time.max, tzinfo=timezone.utc)

    client_logs = db.session.scalars(
        select(WorkoutLog)
        .where(WorkoutLog.client_id == client_id, WorkoutLog.performed_at >= start_day, WorkoutLog.performed_at <= end_day
               )
    ).all()

    return client_logs

def get_today_summary(client_id, routine):
    if not routine:
        return {
            "completed_exercises": 0,
            "total_exercises": 0,
            "volume": 0,
            "estimated_minutes": 0,
            "estimated_calories": 0
        }
    
    total_exercises = len(routine.exercises)
    today_logs = get_today_logs(client_id)

    routine_exercise_ids = {
        exercise.id for exercise in routine.exercises
    }

    completed_exercises = {
        log.exercise_id for log in today_logs
        if log.exercise_id in routine_exercise_ids
    }

    completed_count = len(completed_exercises)

    volume = sum(log.weight * log.reps for log in today_logs)

    estimated_minutes = completed_count * 12

    estimated_calories = estimated_minutes * 7

    return {
        "completed_exercises": completed_count,
        "total_exercises": total_exercises,
        "volume": volume,
        "estimated_minutes": estimated_minutes,
        "estimated_calories": estimated_calories
    }