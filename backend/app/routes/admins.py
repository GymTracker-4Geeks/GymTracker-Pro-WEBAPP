from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select, or_
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import DBAPIError

from app.models import Admin, User, Trainer
from app.extensions import db

admins_bp = Blueprint("admins", __name__)

###########################
#       GET METHODS       #
###########################
@admins_bp.route("/", methods=["GET"])
@jwt_required()
def get_me():
    user_id = int(get_jwt_identity())

    try:
        admin = db.session.scalar(select(Admin).options(joinedload(Admin.user)).where(Admin.user_id == user_id))

        if not admin:
            return jsonify({"error": "Admin not found"}), 404
    
        if not admin.user:
            return jsonify({"error": "User profile data is missing"}), 404
    
        return jsonify(admin.user.to_dict()), 200
    except DBAPIError:
        return jsonify({"error": "Database error occurred."}), 500

@admins_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users_infinite():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    search = request.args.get("search", "").strip()

    offset_value = (page - 1) * per_page

    try:
        stmt = select(User)

        if search:
            stmt = stmt.where(
                or_(
                    User.full_name.like(f"%{search}%"), 
                    User.email.like(f"%{search}%")
                )
            )

        stmt = (
            stmt
            .order_by(User.id.desc())
            .limit(per_page)
            .offset(offset_value)
        )

        users = db.session.scalars(stmt).all()

        return jsonify({
            "users": [user.to_dict() for user in users],
            "has_more": len(users) == per_page
        }), 200

    except DBAPIError:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred."
        }), 500
    
@admins_bp.route("/my-role", methods=["GET"])
@jwt_required()
def get_role():
    user_id = int(get_jwt_identity())

    try:
        user = db.session.scalar(select(User).where(User.id == user_id))

        if not user:
            return jsonify({"error": "User not found"}), 404
        
        role = user.role
        return jsonify(role), 200
    
    except DBAPIError:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred."
        }), 500

###########################
#      PATCH METHODS      #
###########################
@admins_bp.route("/users/<int:user_id>/role", methods=["PATCH"])
@jwt_required()
def change_role(user_id):
    current_user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    allowed_roles = {"trainer", "client"}
    new_role = data.get("role")

    if new_role not in allowed_roles:
        return jsonify({"error": "Invalid role"}), 400

    try:
        admin = db.session.scalar(
            select(Admin)
            .where(Admin.user_id == current_user_id)
        )

        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user.id == current_user_id:
            return jsonify({
                "error": "You cannot change your own role."
            }), 403
        
        if user.role == "admin":
            return jsonify({
            "error": "Admin roles cannot be modified."
        }), 403

        if user.role == new_role:
            return jsonify({"error": f"User already has the {new_role} role."}), 400

        if user.role == "trainer" and new_role == "client":
            trainer = db.session.scalar(
                select(Trainer).where(Trainer.user_id == user.id)
            )
            if trainer:
                db.session.delete(trainer)

        elif user.role == "client" and new_role == "trainer":
            trainer_exists = db.session.scalar(
                select(Trainer).where(Trainer.user_id == user.id)
            )
            if not trainer_exists:
                trainer = Trainer(user_id=user.id, specialty="General")
                db.session.add(trainer)

        user.role = new_role
        db.session.commit()
        db.session.refresh(user)

        return jsonify({
            "message": "Role updated successfully.",
            "user": user.to_dict()
        }), 200

    except DBAPIError:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred."
        }), 500