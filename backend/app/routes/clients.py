from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

from app.utils import get_current_client
from app.models import BodyWeight
from app.extensions import db

clients_bp = Blueprint("clients", __name__)

###########################
#       GET METHODS       #
###########################
@clients_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me_info():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    client_data = client.to_dict()
    client_data["full_name"] = client.user.full_name
    client_data["email"] = client.user.email

    return jsonify(client_data), 200

@clients_bp.route("/trainer", methods=["GET"])
@jwt_required()
def get_trainer():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found."}), 404
 
    if not client.trainer:
        return jsonify({"trainer": None}), 200
    
    trainer_data = client.trainer.to_dict()
    trainer_data["full_name"] = client.trainer.user.full_name
    trainer_data["email"] = client.trainer.user.email
    trainer_data["specialty"] = client.trainer.specialty

    return jsonify({
        "trainer": trainer_data
    }), 200

@clients_bp.route("/weight", methods=["GET"])
@jwt_required()
def get_weight():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

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
    user_id = int(get_jwt_identity())
    
    client = get_current_client(user_id)

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
    user_id = int(get_jwt_identity())

    new_height_value = data.get("height")
    if new_height_value is None:
        return jsonify({"error": "Height value is required."}), 400

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    try:
        client.height = float(new_height_value)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid height value."}), 400
    
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
    user_id = int(get_jwt_identity())

    new_weight_value = data.get("weight")
    if new_weight_value is None:
        return jsonify({"error": "Weight value is required."}), 400
    
    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found."}), 404
    
    try:
        weight = float(new_weight_value)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid weight value."}), 400

    new_body_weight = BodyWeight(
        client_id=client.id,
        weight=weight
    )

    db.session.add(new_body_weight)
    db.session.commit()

    return jsonify({
        "message": "Weight successfully saved in database.",
        "weight": new_body_weight.to_dict()
        }), 201