from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import DBAPIError

from app.models import Routine, Exercise, ClientRoutine
from app.extensions import db
from app.utils import validate_fields, validate_positive_integers, get_current_trainer, get_current_client, get_library_exercise_id

exercises_bp = Blueprint("exercises", __name__)

###########################
#       GET METHODS       #
###########################
@exercises_bp.route("/", methods=["GET"])
@jwt_required()
def get_exercises():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)
    trainer = get_current_trainer(user_id)

    if not client and not trainer:
        return jsonify({"error": "Access denied"}), 403

    if client:
        client_routines = db.session.scalars(
            select(ClientRoutine).where(ClientRoutine.client_id == client.id)
        ).all()

        if not client_routines:
            return jsonify([]), 200

        routine_ids = [cr.routine_id for cr in client_routines]
        exercises = db.session.scalars(
            select(Exercise)
            .where(Exercise.routine_id.in_(routine_ids))
            .options(selectinload(Exercise.library_exercise))
        ).all()
    else:
        exercises = db.session.scalars(
            select(Exercise).options(selectinload(Exercise.library_exercise))
        ).all()

    return jsonify([exercise.to_dict() for exercise in exercises])

@exercises_bp.route("/routines/<int:routine_id>", methods=["GET"])
@jwt_required()
def get_routine_exercises(routine_id):
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    routine = db.session.scalar(
        select(Routine)
        .where(Routine.id == routine_id, Routine.trainer_id == trainer.id)
    )

    if not routine:
        return jsonify({"error": "Routine not found or unauthorized"}), 404

    return jsonify([item.to_dict() for item in routine.exercises]), 200
############################
#       POST METHODS       #
############################
@exercises_bp.route("/routines/<int:routine_id>", methods=["POST"])
@jwt_required()
def create_routine_exercise(routine_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    if not validate_fields(data, ["name", "sets", "reps", "muscle_group"]):
        return jsonify({"error": "Required fields are missing."}), 400
    
    if not validate_positive_integers(data, ["sets", "reps"]):
        return jsonify({"error": "Fields 'sets' and 'reps' must be positive integers."}), 400
    
    trainer = get_current_trainer(user_id)
    
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    
    routine = db.session.scalar(
        select(Routine)
        .where(Routine.id == routine_id, Routine.trainer_id == trainer.id))

    if not routine:
        return jsonify({"error": "Routine not found or access denied"}), 404
    
    try:
        exercise = Exercise(
            name=str(data.get("name")).strip(),
            sets=int(data.get("sets")),
            reps=int(data.get("reps")),
            muscle_group=str(data.get("muscle_group")).strip(),
            routine_id=routine_id,
            library_exercise_id=get_library_exercise_id(str(data.get("name")).strip())
        )

        db.session.add(exercise)
        db.session.commit()
        db.session.refresh(exercise)

        return jsonify({
            "message": "Exercise created successfully in the database",
            "exercise": exercise.to_dict()
        }), 201

    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while saving exercise"}), 500
############################
#      DELETE METHODS      #
############################
@exercises_bp.route("/<int:exercise_id>", methods=["DELETE"])
@jwt_required()
def delete_exercise(exercise_id):
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)
    
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
      
    exercise = db.session.scalar(select(Exercise).join(Routine).where(Exercise.id == exercise_id, Routine.trainer_id == trainer.id))

    if not exercise:
        return jsonify({"error": "Exercise not found or access denied"}), 404
    
    try:
        db.session.delete(exercise)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while deleting routine"}), 500

    return jsonify({"message": "Exercise deleted successfully in the database"}), 200
###########################
#      PATCH METHODS      #
###########################
@exercises_bp.route("/<int:exercise_id>", methods=["PATCH"])
@jwt_required()
def edit_exercise(exercise_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    
    exercise = db.session.scalar(select(Exercise).join(Routine).where(Exercise.id == exercise_id, Routine.trainer_id == trainer.id))

    if not exercise:
        return jsonify({"error": "Exercise not found or access denied"}), 404
    
    exercise_fields_str = ["name", "muscle_group"]
    exercise_fields_int = ["sets", "reps"]

    for fields in exercise_fields_str:
        if fields in data:
            if not validate_fields({fields: data[fields]}, [fields]) or str(data[fields]).strip() == "":
                return jsonify({"error": f"Field '{fields}' cannot be empty or none"}), 400
            
            setattr(exercise, fields, data[fields].strip())

    for fields in exercise_fields_int:
        if fields in data:
            if not validate_positive_integers({fields: data[fields]}, [fields]):
                return jsonify({"error": f"Field '{fields}' need to be a positive integer"}), 400
            
            setattr(exercise, fields, data[fields])

    try:
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    return jsonify({
        "message": "Routine Exercise edited successfully in the database",
        "exercise": exercise.to_dict()
        }), 200