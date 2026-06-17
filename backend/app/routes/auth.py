from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select

from app.models import User, Client
from app.extensions import db
from app.services import EmailService
from app.utils import validate_fields

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not validate_fields(data, ["email", "password", "full_name"]):
        return jsonify({"error": "Required fields are missing."}), 400
    
    if data.get("password") != data.get("confirm_password"):
        return jsonify({"error": "Password and Confirm Password do not match."}), 400
    
    if db.session.execute(
        select(User).where(User.email == data.get("email"))
        ).scalar_one_or_none():
        return jsonify({"error": "Email already in use"}), 409
     
    user = User(
        full_name = data.get("full_name"),        
        email = data.get("email"),
        role="client"
    )

    user.set_password(data.get("password"))

    db.session.add(user)
    db.session.flush()

    client = Client(user_id=user.id)

    db.session.add(client)
    db.session.commit()

    # EmailService.send_welcome_email(data.get("email"), data.get("full_name"))
    
    return jsonify({"message": "User created successfully."}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not validate_fields(data, ["email", "password"]):
        return jsonify({"error": "Required fields are missing."}), 400
    
    user = db.session.execute(
        select(User).where(User.email == data.get("email"))
    ).scalar_one_or_none()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Incorrect credentials."}), 401
    
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/change-password", methods=["PATCH"])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    data = request.get_json()

    if data.get("new_password") != data.get("confirm_new_password"):
        return jsonify({"error": "New Password and Confirm Password do not match."}), 400
    
    user.set_password(data.get("new_password"))
    db.session.commit()
    return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route("/reset-password", methods=["GET", "POST"])
def reset_password():
    if request.method == "GET":
        token = request.args.get("token")
        if not token:
            return jsonify({"error": "Token required."}), 400

        user = db.session.execute(
            select(User).where(User.token_password_reset == token)
        ).scalar_one_or_none()

        if not user:
            return jsonify({"error": "This token is expired or invalid."}), 400

        return jsonify({"Valid": True}), 200

    if request.method == "POST":
        data = request.get_json()
        token = data.get("token")

        user = db.session.execute(
            select(User).where(User.token_password_reset == token)
        ).scalar_one_or_none()

        if not user:
            return jsonify({"error": "This token is expired or invalid."}), 400
        
        if data.get("new_password") != data.get("confirm_new_password"):
            return jsonify({"error": "New Password and Confirm Password do not match."}), 400

        user.set_password(data.get("new_password"))
        user.token_password_reset = None 
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200

@auth_bp.route("/forget-password", methods=["POST"])
def forget_password():
    data = request.get_json()

    user = db.session.execute(
        select(User).where(User.email == data.get("email"))
    ).scalar_one_or_none()

    if user:
        token = user.generate_reset_token()
        db.session.commit()
        try:
            EmailService.send_token_password_email(data.get("email"), token)
        except Exception as error:
            print(f"error: {error}")

    return jsonify({"message": "Your email has been sent successfully, but only if the email exists."})
    