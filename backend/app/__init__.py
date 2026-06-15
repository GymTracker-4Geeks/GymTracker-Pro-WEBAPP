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
    cors.init_app(app, origins=["http://localhost:3000"])

    from .routes.auth import auth_bp
    from .routes.clients import clients_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(clients_bp, url_prefix="/api/client")

    return app