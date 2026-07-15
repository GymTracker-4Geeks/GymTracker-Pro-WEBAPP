from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import select, func
import math

from app.models import ExerciseLibrary
from app.extensions import db

exercise_library_bp = Blueprint("exercise_library", __name__)

def _paginate(stmt, page, per_page):
    total = db.session.scalar(
        select(func.count()).select_from(stmt.subquery())
    ) or 0

    items = db.session.scalars(
        stmt.offset((page - 1) * per_page).limit(per_page)
    ).all()

    pages = math.ceil(total / per_page) if total > 0 else 0

    return {
        "items": [item.to_dict() for item in items],
        "page": page,
        "per_page": per_page,
        "total": total,
        "pages": pages,
        "has_next": page < pages,
        "has_prev": page > 1,
    }
###########################
#       GET METHODS       #
###########################
@exercise_library_bp.route("/", methods=["GET"])
@jwt_required()
def list_exercises():
    """List exercises with pagination and optional filters.

    Query params:
        page (int, default=1): Page number.
        per_page (int, default=20, max=50): Items per page.
        search (str, optional): Partial match on name.
        body_part (str, optional): Exact match on body part.
        target (str, optional): Exact match on target muscle.
        equipment (str, optional): Exact match on equipment.

    Returns:
        200: Paginated list with items, page, per_page, total, pages,
             has_next, has_prev.
        400: Invalid page or per_page.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    if page < 1:
        return jsonify({"error": "page must be a positive integer"}), 400
    if per_page < 1 or per_page > 50:
        return jsonify({"error": "per_page must be between 1 and 50"}), 400

    stmt = select(ExerciseLibrary)

    search = request.args.get("search", "").strip()
    body_part = request.args.get("body_part", "").strip()
    target = request.args.get("target", "").strip()
    equipment = request.args.get("equipment", "").strip()

    if search:
        stmt = stmt.where(ExerciseLibrary.name.ilike(f"%{search}%"))
    if body_part:
        stmt = stmt.where(ExerciseLibrary.body_part == body_part)
    if target:
        stmt = stmt.where(ExerciseLibrary.target == target)
    if equipment:
        stmt = stmt.where(ExerciseLibrary.equipment == equipment)

    stmt = stmt.order_by(ExerciseLibrary.id)
    return jsonify(_paginate(stmt, page, per_page)), 200

@exercise_library_bp.route("/filters", methods=["GET"])
@jwt_required()
def get_filters():
    """Return distinct values for filter dropdowns.

    Returns:
        200: Object with body_parts, targets, and equipments lists.
    """
    body_parts = db.session.scalars(
        select(ExerciseLibrary.body_part).distinct().order_by(ExerciseLibrary.body_part)
    ).all()

    targets = db.session.scalars(
        select(ExerciseLibrary.target).distinct().order_by(ExerciseLibrary.target)
    ).all()

    equipments = db.session.scalars(
        select(ExerciseLibrary.equipment).distinct().order_by(ExerciseLibrary.equipment)
    ).all()

    return jsonify({
        "body_parts": list(body_parts),
        "targets": list(targets),
        "equipments": list(equipments),
    }), 200

@exercise_library_bp.route("/<int:exercise_id>", methods=["GET"])
@jwt_required()
def get_exercise(exercise_id):
    """Return a single exercise by its internal ID.

    Path params:
        exercise_id (int): Internal ExerciseLibrary ID.

    Returns:
        200: Exercise object.
        404: Exercise not found.
    """
    exercise = db.session.scalar(
        select(ExerciseLibrary).where(ExerciseLibrary.id == exercise_id)
    )

    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    return jsonify(exercise.to_dict()), 200