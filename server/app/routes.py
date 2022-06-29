from flask import Blueprint, jsonify, request, current_app
import jwt

from .models import User, db
from .utils import token_required

routes_bp = Blueprint("routes", __name__)


@routes_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    try:
        name = data["name"]
        password = data["password"]
    except:
        return jsonify({
            "message": "Invalid json format"
        }), 400

    user = User.query.filter_by(name=name).first()

    if not user or not user.verify_password(password):
        return jsonify({
            "message": "Name or password is incorrect"
        }), 400

    token = jwt.encode({
        "user_id": user.id
    }, current_app.config["JWT_SECRET"])

    return jsonify({
        "user": {
            "id": user.id,
            "name": name,
            "password": password
        },
        "token": token
    })


@routes_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    try:
        name = data["name"]
        password = data["password"]
        password_confirm = data["password_confirm"]
    except:
        return jsonify({
            "message": "Invalid json format"
        }), 400

    if (password != password_confirm):
        return jsonify({
            "message": "Passwords not matched"
        }), 400

    try:
        user = User()

        user.name = name
        user.password = password

        db.session.add(user)
        db.session.commit()
    except:
        db.session.rollback()

        return jsonify({
            "message": "Error occur to create a new user"
        }), 500
    else:
        return jsonify({
            "message": "User created"
        }), 201


@routes_bp.route("/resources")
@token_required
def resources(current_user):
    res = [
        {
            "id": 1,
            "name": "box",
            "color": "black"
        },
        {
            "id": 2,
            "name": "pencil",
            "color": "green"
        },
        {
            "id": 3,
            "name": "tables",
            "color": "wood"
        },
        {
            "id": 4,
            "name": "book",
            "color": "blue"
        }
    ]

    return jsonify(res)