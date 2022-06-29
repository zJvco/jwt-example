from flask import Flask
from flask_cors import CORS

from .routes import routes_bp
from .models import db

cors = CORS()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///dev.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET"] = "3naDSs989d2DMaodm2mc3gb985NAS6DdsaCV"
    
    db.init_app(app)
    cors.init_app(app)

    # Creating database
    with app.app_context():
        db.create_all()

    app.register_blueprint(routes_bp, url_prefix="/api/v1/")

    return app