from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.exc import DBAPIError

from app.services.dashboard_service import get_today_routine
from app.models import Client, ClientRoutine, Routine, Trainer, Exercise
from app.extensions import db
from app.utils import validate_fields, validate_positive_integers, get_current_client, get_current_trainer

routines_bp = Blueprint("routines", __name__)

###########################
#       GET METHODS       #
###########################
@routines_bp.route("/", methods=["GET"])
@jwt_required()
def get_routines():
    user_id = int(get_jwt_identity())

    join_stmt = (
        select(Client)
        .where(Client.user_id == user_id)
        .options(
            selectinload(Client.routines)
            .selectinload(ClientRoutine.routine)
            )
        )

    client = db.session.scalars(join_stmt).first()
    
    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    if not client.routines:
        return jsonify({"routines": None}), 200
    
    client_data = client.to_dict()

    client_data["routines"] = [item.routine.to_dict() for item in client.routines if item.routine]

    return jsonify(client_data), 200

@routines_bp.route("/<int:routine_id>", methods=["GET"])
@jwt_required()
def get_routine(routine_id):
    user_id = int(get_jwt_identity())

    try:
        stmt = (
            select(ClientRoutine)
            .join(Client)
            .where(
                Client.user_id == user_id,
                ClientRoutine.routine_id == routine_id
            )
            .options(
                joinedload(ClientRoutine.routine)
                .joinedload(Routine.exercises)
            )
        )

        client_routine = db.session.scalar(stmt)

        if not client_routine:
            return jsonify({
                "error": "Routine not found or access denied."
            }), 404

        return jsonify(client_routine.routine.to_dict()), 200

    except DBAPIError:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred."
        }), 500

@routines_bp.route("/today", methods=["GET"])
@jwt_required()
def get_client_today_routine():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    today_routine = get_today_routine(client.id)

    if not today_routine:
        return jsonify({"message": "No routine today"}), 200
    
    return jsonify(today_routine.to_dict()), 200
############################
#       POST METHODS       #
############################
@routines_bp.route("", methods=["POST"])
@jwt_required()
def create_routine():
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    stmt = (select(Trainer).where(Trainer.user_id == user_id))
    trainer = db.session.scalars(stmt).first()

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    if not data.get("name") or str(data.get("name")).strip() == "":
        return jsonify({"error": "Field 'routine_name' is required and cannot be empty"}), 400
    
    routine = Routine(
        name=str(data.get("name")).strip(),
        description=str(data.get("description", "")),
        trainer_id=trainer.id
    )

    exercises = data.get("exercises", [])

    for exercise_data in exercises:
        if not validate_fields(exercise_data, ["name", "sets", "reps", "muscle_group"]):
            return jsonify({"error": "Each exercise must have 'name', 'sets', 'reps', and 'muscle_group'"}), 400
        
        if not validate_positive_integers(exercise_data, ["sets", "reps"]):
            return jsonify({"error": "Fields 'sets' and 'reps' in exercises must be positive integers"}), 400
        
        new_exercise = Exercise(
            name=str(exercise_data.get("name")).strip(),
            sets=int(exercise_data.get("sets")),
            reps=int(exercise_data.get("reps")),
            muscle_group=str(exercise_data.get("muscle_group", "General")).strip()            
        )
        routine.exercises.append(new_exercise)

    try:
        db.session.add(routine)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    return jsonify({
        "message": "Routine successfully added to the database",
        "routine": routine.to_dict()
        }), 201

@routines_bp.route("/assign", methods=["POST"])
@jwt_required()
def assign_routine():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    routine = db.session.scalar(
        select(Routine).where(Routine.id == data.get("routine_id"))
    )

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    client = get_current_client(data.get("client_id"))

    if not client:
        return jsonify({"error": "Client not found"}), 404

    if not routine.trainer_id == trainer.id:
        return jsonify({"error": "You cannot assign this routine"}), 403

    if not client.trainer_id == trainer.id:
        return jsonify({"error": "You cannot assign a routine to this client"}), 403
    
    day = data.get("routine_day")

    if not day:
        return jsonify({"error": "You have to assign a day to the client"}), 403
    
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    standardized_day = day.strip().capitalize()

    if standardized_day not in days_of_week:
        return jsonify({
            "error": f"Invalid day '{day}'. Must be one of: {', '.join(days_of_week)}"
        }), 400
    
    already_assigned = db.session.scalar(
        select(ClientRoutine).where(
            ClientRoutine.client_id == client.id,
            ClientRoutine.routine_id == routine.id
        )
    )

    if already_assigned:
        return jsonify({"message": "Routine already assigned to this client"}), 200

    new_assignment = ClientRoutine(client_id=client.id, routine_id=routine.id, week_day=standardized_day)
    db.session.add(new_assignment)
    db.session.commit()

    return jsonify({"message": "Routine assigned successfully"}), 200
############################
#      DELETE METHODS      #
############################
@routines_bp.route("/<int:routine_id>", methods=["DELETE"])
@jwt_required()
def delete_routine(routine_id):
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    routine = db.session.scalar(select(Routine).where(Routine.id == routine_id, Routine.trainer_id == trainer.id))

    if not routine:
        return jsonify({"error": "Routine not found or access denied"}), 404

    try:
        db.session.delete(routine)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while deleting exercise"}), 500

    return jsonify({
        "message": "Routine successfully deleted from the database",
        }), 200

@routines_bp.route("/<int:routine_id>/client/<int:client_id>", methods=["DELETE"])
@jwt_required()
def deassign_routine(routine_id, client_id):
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)
    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    
    routine = db.session.scalar(select(Routine).where(Routine.id == routine_id))
    if not routine:
        return jsonify({"error": "Routine not found"}), 404
    
    client = get_current_client(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    if not routine.trainer_id == trainer.id or not client.trainer_id == trainer.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    stmt = select(ClientRoutine).where(
        ClientRoutine.client_id == client.id, 
        ClientRoutine.routine_id == routine.id
    )
    assign_routine = db.session.scalar(stmt)

    if not assign_routine:
        return jsonify({"error": "Assignment not found"}), 404

    db.session.delete(assign_routine)
    db.session.commit()

    return jsonify({"message": "Routine unassigned successfully"}), 200
###########################
#      PATCH METHODS      #
###########################
@routines_bp.route("/<int:routine_id>", methods=["PATCH"])
@jwt_required()
def edit_routine(routine_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    
    routine = db.session.scalar(select(Routine).where(Routine.id == routine_id, Routine.trainer_id == trainer.id))

    if not routine:
        return jsonify({"error": "Routine not found or access denied"}), 404
    
    routine_fields = ["name", "description"]

    for fields in routine_fields:
        if fields in data:
            if not validate_fields({fields: data[fields]}, [fields]) or str(data[fields]).strip() == "":
                return jsonify({"error": f"Field '{fields}' cannot be empty or none"}), 400
        
            setattr(routine, fields, data[fields])

    try:
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
    
    return jsonify({
        "message": "Routine edited successfully in the database",
        "routine": routine.to_dict()
        }), 200