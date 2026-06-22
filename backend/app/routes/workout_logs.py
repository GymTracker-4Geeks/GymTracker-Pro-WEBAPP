from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.exc import DBAPIError

from app.models import WorkoutLog, Exercise
from app.extensions import db
from app.utils import validate_fields, get_current_client 

workouts_bp = Blueprint("workouts", __name__)

###########################
#       GET METHODS       #
###########################
@workouts_bp.route("", methods=["GET"])
@jwt_required()
def get_logs():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    stmt = (
        select(WorkoutLog).where(WorkoutLog.client_id == client.id).options(selectinload(WorkoutLog.exercise)))
    
    logs = db.session.scalars(stmt).all()

    return jsonify([log.to_dict() for log in logs]), 200

@workouts_bp.route("/<int:workout_id>", methods=["GET"])
@jwt_required()
def get_log(workout_id):
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    try:
        log = db.session.scalar(
            select(WorkoutLog)
            .options(joinedload(WorkoutLog.exercise))
            .where(WorkoutLog.client_id == client.id, WorkoutLog.id == workout_id)
        )
    except DBAPIError:
        return jsonify({"error": "Internal error in the database"}), 500

    if not log:
        return jsonify({"error": "Workout not found or access denied"}), 404
    
    return jsonify({"workout_log": log.to_dict()})
############################
#       POST METHODS       #
############################
@workouts_bp.route("", methods=["POST"])
@jwt_required()
def create_log():
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    if not validate_fields(data, ["exercise_id", "weight", "reps"]):
        return jsonify({"error": "Required fields missing"}), 400
    
    try:
        exercise_id = int(data.get("exercise_id"))
        reps = int(data.get("reps"))
        weight = float(data.get("weight")) 

        if reps <= 0 or weight <= 0:
            return jsonify({"error": "Weight and reps must be positive"}), 400
        
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid Type"}), 400
    
    exercise = db.session.scalar(select(Exercise).where(Exercise.id == data.get("exercise_id")))
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404
    
    workout_log = WorkoutLog(
        client_id=client.id,
        exercise_id=exercise_id,
        weight=weight,
        reps=reps
    )

    db.session.add(workout_log)
    db.session.commit()

    return jsonify({"message": "Workout Log created successfully in the database"}), 201
############################
#      DELETE METHODS      #
############################
@workouts_bp.route("/<int:workout_id>", methods=["DELETE"])
@jwt_required()
def delete_log(workout_id):
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    try:
        log = db.session.scalar(
            select(WorkoutLog)
            .where(WorkoutLog.client_id == client.id, WorkoutLog.id == workout_id)
        )
    except DBAPIError:
        return jsonify({"error": "Internal error in the database"}), 500

    if not log:
        return jsonify({"error": "Workout Log not found or access denied"}), 404
    
    try:
        db.session.delete(log)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Internal error in the database"}), 500
    
    return jsonify({"message": "Workout Log deleted successfully from the database"}), 200