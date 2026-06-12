from flask import Blueprint, jsonify, request
from models.client import Client
from models.user import User
from models.trainer import Trainer
from app.extensions import db


clients_bp = Blueprint('clients', __name__)


@clients_bp.route("/clients", methods=["GET"])
def get_clients():

    clients = Client.query.all()
    clients_data =[
        client.to_dict()
        for client in clients
    ]

    return jsonify(clients_data), 200


    

@clients_bp.route("/clients/<int:client_id>", methods=["GET"])
def get_client(client_id):

    client = Client.query.get(client_id)
    if client is None:
        return jsonify(
            {
            "msg":"Usuario no encontrado"
            }
        ), 404
    
    return jsonify(client.to_dict()), 200
    
    


@clients_bp.route("/clients", methods=["POST"])
def create_clients():
    
    data = request.get_json()

    if not data:
        return jsonify({"msg": "JSON inválido"}), 400
    
    user_id = data.get("user_id")
    trainer_id = data.get("trainer_id")

    if not user_id or not trainer_id:
        return jsonify(
            {
            "msg": "User no encontrado"
            }
            ), 404

    user = User.query.get(user_id)
    if user is None: 
        return jsonify(
            {
            "msg":"User no encontrado"
            }
        ), 404
    trainer = Trainer.query.get(trainer_id)

    if trainer is None: 
        return jsonify(
            {
            "msg":"Entrenador no encontrado"
            }
        ), 404
    
    existing_client = Client.query.filter_by(user_id=user_id).first()
    if existing_client:
        return jsonify(
            {
            "msg": "Este usuario ya es cliente"
            }
        ), 409

    new_client = Client(
        user_id = user_id,
        trainer_id = trainer_id,

    )

    db.session.add(new_client)
    db.session.commit()

    return jsonify(new_client.to_dict()), 201

    
