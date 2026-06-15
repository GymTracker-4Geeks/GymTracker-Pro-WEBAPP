from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

from app.models import User, Client, BodyWeight
from app.extensions import db

clients_bp = Blueprint("clients", __name__)

###########################
#       GET METHODS       #
###########################
@clients_bp.route("/<int:client_id>", methods=["GET"])
def get_client(client_id):
    client = db.session.scalar(
        select(Client).where(Client.id == client_id)
    )

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    return jsonify(client.to_dict()), 200

@clients_bp.route("/", methods=["GET"])
def get_clients():
    join_stmt = select(Client).join(User)
    clients = db.session.scalars(join_stmt).all()
    
    if not clients:
        return jsonify({"error": "No saved clients in the database."}), 404
    
    clients_list = []
    for client in clients:
        client_data = client.to_dict()
        client_data["full_name"] = client.user.full_name
        client_data["email"] = client.user.email
        clients_list.append(client_data)

    return jsonify(clients_list), 200

@clients_bp.route("/trainer", methods=["GET"])
@jwt_required()
def get_trainer():
    client_id = get_jwt_identity()
    user = db.session.get(User, client_id)

    if not user:
        return jsonify({"error": "Client not found."}), 404
 
    if not user.trainer:
        return jsonify({"error": "You do not have a trainer set yet."}), 404
    
    return jsonify({
        "trainer": user.trainer.to_dict()
    }), 200

@clients_bp.route("/weight", methods=["GET"])
@jwt_required()
def get_weight():
    user_id = get_jwt_identity()

    query_client = select(Client).where(Client.user_id == user_id)
    client = db.session.scalars(query_client).first()

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    query_weight = (
        select(BodyWeight)
        .where(BodyWeight.client_id == client.id)
        .order_by(BodyWeight.recorded_at.desc())
    )
    
    last_weight = db.session.scalars(query_weight).first()
    
    if not last_weight:
        return jsonify({"error": "You do not have an actual body weight set yet."}), 404
    
    return jsonify({
        "weight": last_weight.to_dict()
    }), 200

@clients_bp.route("/height", methods=["GET"])
@jwt_required()
def get_height():
    client_id = get_jwt_identity()
    
    query_height = (select(Client)
                    .where(Client.user_id == client_id))
    client = db.session.scalars(query_height).first()

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    return jsonify({
        "height": client.height
    }), 200
###########################
#      PATCH METHODS      #
###########################
@clients_bp.route("/height", methods=["PATCH"])
@jwt_required()
def update_height():
    data = request.get_json()
    client_id = get_jwt_identity()

    new_height_value = data.get("height")
    if new_height_value is None:
        return jsonify({"error": "Height value is required."}), 400
    
    query_height = (select(Client)
                    .where(Client.user_id == client_id))
    client = db.session.scalars(query_height).first()

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    client.height = float(new_height_value)
    db.session.commit()

    return jsonify({
        "message": "Height successfully saved in database.",
        "height": client.height
    }), 200
############################
#       POST METHODS       #
############################
@clients_bp.route("/weight", methods=["POST"])
@jwt_required()
def add_weight():
    data = request.get_json()
    user_id = get_jwt_identity()

    new_weight_value = data.get("weight")
    if new_weight_value is None:
        return jsonify({"error": "Weight value is required."}), 400
    
    query_client = select(Client).where(Client.user_id == user_id)
    client = db.session.scalars(query_client).first()

    if not client:
        return jsonify({"error": "Client not found."}), 404

    new_body_weight = BodyWeight(
        client_id=client.id,
        weight=float(new_weight_value)
    )

    db.session.add(new_body_weight)
    db.session.commit()

    return jsonify({
        "message": "Weight successfully saved in database.",
        "weight": new_body_weight.to_dict()
        }), 201