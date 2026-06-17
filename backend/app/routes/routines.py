from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models import Client, ClientRoutine
from app.extensions import db

routines_bp = Blueprint("routines", __name__)

@routines_bp.route("/", methods=["GET"])
@jwt_required()
def get_routine():
    user_id = get_jwt_identity()

    join_stmt = (select(Client).where(Client.user_id == user_id).options(selectinload(Client.routines).selectinload(ClientRoutine.routine)))

    client = db.session.scalars(join_stmt).first()
    
    if not client:
        return jsonify({"error": "Client not found"}), 404
    
    if not client.routines:
        return jsonify({"routines": None}), 200
    
    client_data = client.to_dict()

    client_data["routines"] = [item.routine.to_dict() for item in client.routines if item.routine]

    return jsonify(client_data), 200