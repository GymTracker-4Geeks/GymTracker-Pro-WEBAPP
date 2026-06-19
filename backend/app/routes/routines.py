from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import Client, ClientRoutine, Routine, Trainer
from app.extensions import db
from app.utils import *

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

    join_stmt = (
        select(Client)
        .where(Client.user_id == user_id)
        .options(
            selectinload(Client.routines)
            .filter(ClientRoutine.routine_id == routine_id)
            .selectinload(ClientRoutine.routine)
            .selectinload(Routine.exercises)
            )
        )

    client = db.session.scalars(join_stmt).first()

    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    if not client.routines:
        return jsonify({"error": "Routine not found or access denied"}), 404

    client_routine = client.routines[0]
    id_routine = client_routine.routine

    return jsonify(id_routine.to_dict()), 200
############################
#       POST METHODS       #
############################
@routines_bp.route("/create", methods=["POST"])
@jwt_required()
def create_routine():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    stmt = (select(Trainer).where(Trainer.user_id == user_id))
    trainer = db.session.scalars(stmt).first()

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    routine = Routine(
        name=data.get("routine_name"),
        description=data.get("routine-description"),
        trainer_id=trainer.id
    )

    db.session.add(routine)
    db.session.commit()

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
    
    already_assigned = db.session.scalar(
        select(ClientRoutine).where(
            ClientRoutine.client_id == client.id,
            ClientRoutine.routine_id == routine.id
        )
    )

    if already_assigned:
        return jsonify({"message": "Routine already assigned to this client"}), 200

    new_assignment = ClientRoutine(client_id=client.id, routine_id=routine.id)
    db.session.add(new_assignment)
    db.session.commit()

    return jsonify({"message": "Routine assigned successfully"}), 200
############################
#      DELETE METHODS      #
############################
@routines_bp.route("/delete/<int:routine_id>", methods=["DELETE"])
@jwt_required()
def delete_routine(routine_id):
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404

    routine = db.session.scalar(select(Routine).where(Routine.id == routine_id))

    if not routine:
        return jsonify({"error": "Routine not found"}), 404

    if not routine.trainer_id == trainer.id:
        return jsonify({"error": "You cannot delete this routine from the database"}), 403

    db.session.delete(routine)
    db.session.commit()

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
    
    if routine.trainer_id != trainer.id or client.trainer_id != trainer.id:
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