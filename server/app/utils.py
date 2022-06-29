from flask import current_app, request, jsonify
from functools import wraps
import jwt

from .models import User


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        try:
            token = request.headers["Authorization"]
        except:
            return jsonify({
                "message": "Token was not specified in headers"
            }), 401

        # Removing Bearer from string
        token = token[len("Bearer"):].strip()

        try:
            decoded = jwt.decode(token, current_app.config["JWT_SECRET"], ["HS256"])
        except:
            return jsonify({
                "message": "Invalid token"
            }), 400

        user = User.query.filter_by(id=decoded["user_id"]).first()

        return f(user, *args, **kwargs)

    return decorator