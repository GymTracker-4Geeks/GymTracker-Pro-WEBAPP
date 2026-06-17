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
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
    )

    from .routes.auth import auth_bp
    from .routes.clients import clients_bp
    from .routes.trainers import trainers_bp
    from .routes.routines import routines_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(clients_bp, url_prefix="/api/clients")
    app.register_blueprint(trainers_bp, url_prefix="/api/trainers")
    app.register_blueprint(routines_bp, url_prefix="/api/routines")

    return app