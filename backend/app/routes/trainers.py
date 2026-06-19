from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import Client, Trainer
from app.extensions import db

trainers_bp = Blueprint("trainers", __name__)

###########################
#       GET METHODS       #
###########################
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
############################
#       POST METHODS       #
############################