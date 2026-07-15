from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.exc import DBAPIError

from app.models import User
from app.extensions import db

profiles_bp = Blueprint("profiles", __name__)

@profiles_bp.route("/change-name", methods=["PATCH"])
@jwt_required()
def change_name():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    full_name = data.get("full_name")
    if not full_name or not full_name.strip():
        return jsonify({"error": "The full_name field is required and cannot be empty."}), 400

    try:
        user = db.session.scalar(select(User).where(User.id == user_id))

        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user.full_name = full_name.strip()
        db.session.commit()
        
        return jsonify({"message": "Name updated successfully"}), 200
    except DBAPIError:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred."
        }), 500