from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import Client, Trainer, Routine
from app.extensions import db
from app.utils import get_current_trainer

trainers_bp = Blueprint("trainers", __name__)

###########################
#       GET METHODS       #
###########################
@trainers_bp.route('/my-clients', methods=['GET'])
@jwt_required()
def get_my_clients():
    try:
        current_trainer_id = int(get_jwt_identity())
        
        trainer = get_current_trainer(current_trainer_id)
        
        if not trainer:
            return jsonify({"error": "Trainer profile not found."}), 404

        my_clients = db.session.scalars(
            select(Client)
            .options(selectinload(Client.user))
            .where(Client.trainer_id == trainer.id)
        ).all()
        
        return jsonify([
            {
                "id": client.id, 
                "full_name": client.user.full_name if client.user else "Asigned Client"
            } 
            for client in my_clients
        ]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@trainers_bp.route("/clients/<int:client_id>", methods=["GET"])
@jwt_required()
def get_client(client_id):
    user_id = int(get_jwt_identity())

    client = db.session.scalar(
        select(Client)
        .join(Client.trainer)
        .options(selectinload(Client.user))
        .where(
            Client.id == client_id,
            Trainer.user_id == user_id
        )
    )

    if not client:
        return jsonify({"error": "Client not found or unauthorized."}), 404
    
    client_data = client.to_dict()
    
    if client.user:
        client_data["full_name"] = client.user.full_name
        client_data["email"] = client.user.email
    else:
        client_data["full_name"] = None
        client_data["email"] = None

    return jsonify(client_data), 200

@trainers_bp.route("/clients", methods=["GET"])
@jwt_required()
def get_clients():
    user_id = int(get_jwt_identity())

    clients = db.session.scalars(
        select(Client)
        .join(Client.trainer)
        .options(selectinload(Client.user))
        .where(
            Trainer.user_id == user_id
        )
    ).all()
    
    if not clients:
        return jsonify([]), 200
    
    clients_list = []
    for client in clients:
        client_data = client.to_dict()
        
        if client.user:
            client_data["full_name"] = client.user.full_name
            client_data["email"] = client.user.email
        else:
            client_data["full_name"] = None
            client_data["email"] = None
            
        clients_list.append(client_data)

    return jsonify(clients_list), 200

@trainers_bp.route("/routines", methods=["GET"])
@jwt_required()
def get_routines():
    user_id = int(get_jwt_identity())

    trainer = get_current_trainer(user_id)

    if not trainer:
        return jsonify({"error": "Trainer not found"}), 404
    
    routines = db.session.scalars(select(Routine).where(Routine.trainer_id == trainer.id)).all()
    
    return jsonify([routine.to_dict() for routine in routines]), 200

@trainers_bp.route("/clients/unassigned", methods=["GET"])
@jwt_required()
def get_unassigned_clients():
    try:
        unassigned_clients = db.session.scalars(
            select(Client)
            .options(selectinload(Client.user))
            .where(Client.trainer_id == None)
        ).all()
        
        if not unassigned_clients:
            return jsonify([]), 200
        
        clients_list = []
        for client in unassigned_clients:
            client_data = client.to_dict()
            if client.user:
                client_data["full_name"] = client.user.full_name
                client_data["email"] = client.user.email
            else:
                client_data["full_name"] = "Independent Client"
                client_data["email"] = None
                
            clients_list.append(client_data)

        return jsonify(clients_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
############################
#       POST METHODS       #
############################
@trainers_bp.route('/clients/<int:client_id>/assign', methods=['POST'])
@jwt_required()
def assign_client_to_me(client_id):
    user_id = int(get_jwt_identity())
    
    trainer = get_current_trainer(user_id)
    if not trainer:
        return jsonify({"error": "Trainer profile not found."}), 404

    client = db.session.get(Client, client_id)
    
    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    if client.trainer_id is not None:
        return jsonify({"error": "This client already has an assigned trainer."}), 400

    try:
        client.trainer_id = trainer.id
        db.session.commit()

        return jsonify({
            "message": "Client successfully linked to your account.",
            "client_id": client.id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500