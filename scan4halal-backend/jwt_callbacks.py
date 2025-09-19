# jwt_callbacks.py
from flask import jsonify
from flask_jwt_extended import JWTManager

# This will be set in app.py after app creation
jwt = JWTManager()

# Custom response when no JWT is provided
@jwt.unauthorized_loader
def custom_unauthorized_response(err_str):
    return jsonify({"msg": "Please log in to save scan results"}), 401

# Custom response when JWT is invalid
@jwt.invalid_token_loader
def custom_invalid_token_response(err_str):
    return jsonify({"msg": "Invalid token. Please log in again"}), 401

# Custom response when JWT has expired
@jwt.expired_token_loader
def custom_expired_token_response(jwt_header, jwt_payload):
    return jsonify({"msg": "Session expired. Please log in again"}), 401
