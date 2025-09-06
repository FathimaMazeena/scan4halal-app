from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt, get_jwt_identity
)
from datetime import timedelta, datetime
# from db.connection import users_collection  # your existing connection
from db import collection, users_collection, scan_collection
from bson import ObjectId
import re

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# --- helpers ---
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def clean_email(email: str) -> str:
    return email.strip().lower()

def user_to_public(u):
    return {
        "id": str(u["_id"]),
        "email": u["email"],
        "role": u.get("role", "user"),
        "name": u.get("profile", {}).get("name", ""),
        "created_at": u.get("created_at"),
        "stats": u.get("stats", {"scans_count": 0, "bookmarks_count": 0}),
    }

# --- routes ---
@auth_bp.post("/signup")
def signup():
    data = request.get_json(force=True)
    email = clean_email(data.get("email", ""))
    password = data.get("password", "")
    name = data.get("name", "")

    if not EMAIL_RE.match(email):
        return jsonify({"error": "Invalid email"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    existing = users_collection.find_one({"email": email})
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    user_doc = {
        "email": email,
        "password_hash": generate_password_hash(password),
        "role": "user",                              # default role
        "profile": {"name": name, "avatar_url": ""},
        "settings": {"newsletter": False},
        "stats": {"scans_count": 0, "bookmarks_count": 0},
        "created_at": datetime.utcnow(),
        "last_login_at": None,
    }
    res = users_collection.insert_one(user_doc)
    user_doc["_id"] = res.inserted_id

    # include role in JWT claims for quick checks
    additional_claims = {"role": user_doc["role"]}
    access_token = create_access_token(
        identity=str(user_doc["_id"]),
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=12),
    )
    return jsonify({"user": user_to_public(user_doc), "access_token": access_token}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(force=True)
    email = clean_email(data.get("email", ""))
    password = data.get("password", "")

    user = users_collection.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    users_collection.update_one(
        {"_id": user["_id"]}, {"$set": {"last_login_at": datetime.utcnow()}}
    )

    additional_claims = {"role": user.get("role", "user")}
    access_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=12),
    )
    return jsonify({"user": user_to_public(user), "access_token": access_token}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user_to_public(user)}), 200
