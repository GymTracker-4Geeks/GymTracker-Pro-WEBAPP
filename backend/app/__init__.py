from flask import Flask
from .extensions import db, cors, jwt, migrate
from config import Config

from app.models import *

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, origins=["http://localhost:5173"])

    return app