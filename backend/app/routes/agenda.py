from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Session
from app.utils import validate_fields

agenda_bp = Blueprint('agenda', __name__)

###########################
#       GET METHODS       #
###########################
@agenda_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not start_date_str or not end_date_str:
        return jsonify({"error": "Missing start_date and end_date parameters"}), 400

    try:
        current_trainer_id = int(get_jwt_identity())
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

        sessions_query = Session.query.filter(
            Session.date >= start_date, 
            Session.date <= end_date,
            Session.trainer_id == current_trainer_id
        ).all()
        
        return jsonify([session.to_dict() for session in sessions_query]), 200
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
############################
#       POST METHODS       #
############################
@agenda_bp.route('/sessions', methods=['POST'])
@jwt_required()
def create_session():
    data = request.get_json()

    if not validate_fields(data, ("date", "hour", "client_id")):
        return jsonify({"error": "Missing required fields (date, hour, client_id) to create the session"}), 400

    try:
        current_trainer_id = int(get_jwt_identity())

        new_session = Session(
            date=datetime.strptime(data['date'], "%Y-%m-%d").date(),
            hour=int(data['hour']),
            type=data.get('type', '1-on-1'),
            color=data.get('color', 'bg-primary/90'),
            client_id=int(data['client_id']),
            trainer_id=current_trainer_id 
        )

        db.session.add(new_session)
        db.session.commit()

        return jsonify({"message": "Session scheduled successfully", "session": new_session.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
############################
#      DELETE METHODS      #
############################
@agenda_bp.route('/sessions/<int:session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    try:
        current_user_id = int(get_jwt_identity())

        session_to_delete = db.session.get(Session, session_id)
        
        if not session_to_delete:
            return jsonify({"error": "Session not found"}), 404

        if int(session_to_delete.trainer_id) != current_user_id:
            return jsonify({"error": "Unauthorized to delete this session"}), 403

        db.session.delete(session_to_delete)
        db.session.commit()

        return jsonify({"message": "Session deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
