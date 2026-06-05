from flask import Flask
from extensions import db, cors, jwt
from config import Config

from models import *

app = Flask("app")
app.config.from_object(Config)

db.init_app(app)
jwt.init_app(app)
cors.init_app(app, origins=["http://localhost:5173"])

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)