from sqlalchemy import select

from app.models import Client
from app.extensions import db

def validate_fields(data, fields):
    return data and all(k in data and data[k] for k in fields)

def get_current_client(user_id):
    return db.session.scalar(
        select(Client).where(Client.user_id == user_id)
    )