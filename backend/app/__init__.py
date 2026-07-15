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
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    from .routes.auth import auth_bp
    from .routes.admins import admins_bp
    from .routes.agenda import agenda_bp
    from .routes.clients import clients_bp
    from .routes.trainers import trainers_bp
    from .routes.routines import routines_bp
    from .routes.profiles import profiles_bp
    from .routes.exercises import exercises_bp
    from .routes.workout_logs import workouts_bp
    from .routes.exercise_library import exercise_library_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admins_bp, url_prefix="/api/admins")
    app.register_blueprint(agenda_bp, url_prefix="/api/agenda")
    app.register_blueprint(clients_bp, url_prefix="/api/clients")
    app.register_blueprint(trainers_bp, url_prefix="/api/trainers")
    app.register_blueprint(routines_bp, url_prefix="/api/routines")
    app.register_blueprint(profiles_bp, url_prefix="/api/profiles")    
    app.register_blueprint(exercises_bp, url_prefix="/api/exercises")
    app.register_blueprint(workouts_bp, url_prefix="/api/workouts")
    app.register_blueprint(exercise_library_bp, url_prefix="/api/exercise-library")

    return app