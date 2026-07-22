from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import DBAPIError

from app.models import WorkoutLog, Exercise
from app.extensions import db
from app.utils import validate_fields, validate_positive_integers, validate_positive_float, get_current_client

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
        select(WorkoutLog)
        .where(WorkoutLog.client_id == client.id)
        .options(joinedload(WorkoutLog.exercise))
    )

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
        return jsonify({"error": "Database error"}), 500

    if not log:
        return jsonify({"error": "Workout Log not found or access denied"}), 404

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

    if not validate_positive_integers(data, ["exercise_id", "reps"]):
        return jsonify({"error": "exercise_id and reps must be positive integers"}), 400

    if not validate_positive_float(data, ["weight"]):
        return jsonify({"error": "weight must be positive"}), 400

    sets = int(data.get("sets", 1))
    if "sets" in data and not validate_positive_integers(data, ["sets"]):
        return jsonify({"error": "sets must be a positive integer"}), 400

    exercise = db.session.scalar(
        select(Exercise).where(Exercise.id == int(data["exercise_id"]))
    )
    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    try:
        workout_log = WorkoutLog(
            client_id=client.id,
            exercise_id=int(data["exercise_id"]),
            weight=float(data["weight"]),
            reps=int(data["reps"]),
            sets=int(data.get("sets", 1)),
        )

        db.session.add(workout_log)
        db.session.commit()
        db.session.refresh(workout_log)

        return jsonify({
            "message": "Workout Log created successfully",
            "workout_log": workout_log.to_dict()
        }), 201

    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
###########################
#      PATCH METHODS      #
###########################
@workouts_bp.route("/<int:workout_id>", methods=["PATCH"])
@jwt_required()
def edit_log(workout_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    log = db.session.scalar(
        select(WorkoutLog).where(
            WorkoutLog.client_id == client.id,
            WorkoutLog.id == workout_id
        )
    )

    if not log:
        return jsonify({"error": "Workout Log not found or access denied"}), 404

    int_fields = ["reps", "sets"]
    float_fields = ["weight"]

    for field in int_fields:
        if field in data:
            if not validate_positive_integers(data, [field]):
                return jsonify({"error": f"{field} must be a positive integer"}), 400
            setattr(log, field, int(data[field]))

    for field in float_fields:
        if field in data:
            if not validate_positive_float(data, [field]):
                return jsonify({"error": f"{field} must be positive"}), 400
            setattr(log, field, float(data[field]))

    try:
        db.session.commit()
        db.session.refresh(log)

        return jsonify({
            "message": "Workout Log updated successfully",
            "workout_log": log.to_dict()
        }), 200

    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
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
        return jsonify({"error": "Database error"}), 500

    if not log:
        return jsonify({"error": "Workout Log not found or access denied"}), 404

    try:
        db.session.delete(log)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    return jsonify({"message": "Workout Log deleted successfully"}), 200
