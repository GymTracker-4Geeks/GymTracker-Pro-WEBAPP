from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select

from app.models import User
from app.extensions import db
from app.utils import validate_fields

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not validate_fields(data, ["email", "password", "full_name"]):
        return jsonify({"Error": "Required fields are missing."}), 400
    
    if data["password"] != data["confirm_password"]:
        return jsonify({"Error": "Password and ConfirmPassword do not match."}), 400

    if db.session.execute(
        select(User).where(User.username == data["username"])
        ).scalar_one_or_none():
        return jsonify({"Error": "Username already in use"}), 409
    
    if db.session.execute(
        select(User).where(User.email == data["email"])
        ).scalar_one_or_none():
        return jsonify({"Error": "Email already in use"}), 409
     
    user = User(
        username = data.get("username"),
        email = data.get("email"),
    )

    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()
    
    return jsonify({"Message": "User created successfully."}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not validate_fields(data, ["email", "password"]):
        return jsonify({"Error": "Required fields are missing."}), 400
    
    user = db.session.execute(
        select(User).where(User.email == data["email"])
    ).scalar_one_or_none()

    if not user and not User.check_password(user.password_hash, data["password"]):
        return jsonify({"Error": "Incorrect credentials."}), 401
    
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    }), 200