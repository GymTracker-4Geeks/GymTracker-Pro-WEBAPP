from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select
from sqlalchemy.exc import DBAPIError

from app.models import BodyWeight
from app.extensions import db
from app.utils import validate_fields, validate_positive_float, get_current_client

bodyweight_bp = Blueprint("bodyweight", __name__)

###########################
#       GET METHODS       #
###########################
@bodyweight_bp.route("", methods=["GET"])
@jwt_required()
def get_weights():
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    stmt = (
        select(BodyWeight)
        .where(BodyWeight.client_id == client.id)
        .order_by(BodyWeight.recorded_at.desc())
    )

    weights = db.session.scalars(stmt).all()

    return jsonify([w.to_dict() for w in weights]), 200

@bodyweight_bp.route("/<int:weight_id>", methods=["GET"])
@jwt_required()
def get_weight(weight_id):
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    weight = db.session.scalar(
        select(BodyWeight).where(
            BodyWeight.client_id == client.id,
            BodyWeight.id == weight_id
        )
    )

    if not weight:
        return jsonify({"error": "Weight record not found or access denied"}), 404

    return jsonify({"body_weight": weight.to_dict()}), 200
############################
#       POST METHODS       #
############################
@bodyweight_bp.route("", methods=["POST"])
@jwt_required()
def create_weight():
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    if not validate_fields(data, ["weight"]):
        return jsonify({"error": "Required fields missing"}), 400

    if not validate_positive_float(data, ["weight"]):
        return jsonify({"error": "weight must be positive"}), 400

    try:
        body_weight = BodyWeight(
            client_id=client.id,
            weight=float(data["weight"]),
        )

        db.session.add(body_weight)
        db.session.commit()
        db.session.refresh(body_weight)

        return jsonify({
            "message": "Weight record created successfully",
            "body_weight": body_weight.to_dict()
        }), 201

    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
###########################
#      PATCH METHODS      #
###########################
@bodyweight_bp.route("/<int:weight_id>", methods=["PATCH"])
@jwt_required()
def edit_weight(weight_id):
    data = request.get_json() or {}
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    weight_record = db.session.scalar(
        select(BodyWeight).where(
            BodyWeight.client_id == client.id,
            BodyWeight.id == weight_id
        )
    )

    if not weight_record:
        return jsonify({"error": "Weight record not found or access denied"}), 404

    if "weight" in data:
        if not validate_positive_float(data, ["weight"]):
            return jsonify({"error": "weight must be positive"}), 400
        weight_record.weight = float(data["weight"])

    try:
        db.session.commit()
        db.session.refresh(weight_record)

        return jsonify({
            "message": "Weight record updated successfully",
            "body_weight": weight_record.to_dict()
        }), 200

    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500
############################
#      DELETE METHODS      #
############################
@bodyweight_bp.route("/<int:weight_id>", methods=["DELETE"])
@jwt_required()
def delete_weight(weight_id):
    user_id = int(get_jwt_identity())

    client = get_current_client(user_id)

    if not client:
        return jsonify({"error": "Client not found"}), 404

    weight_record = db.session.scalar(
        select(BodyWeight).where(
            BodyWeight.client_id == client.id,
            BodyWeight.id == weight_id
        )
    )

    if not weight_record:
        return jsonify({"error": "Weight record not found or access denied"}), 404

    try:
        db.session.delete(weight_record)
        db.session.commit()
    except DBAPIError:
        db.session.rollback()
        return jsonify({"error": "Database error"}), 500

    return jsonify({"message": "Weight record deleted successfully"}), 200
