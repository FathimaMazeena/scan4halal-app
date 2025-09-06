from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId
# from db.connection import scan_collection
from db import collection, users_collection, scan_collection
from bson import ObjectId

scans_bp = Blueprint("scans", __name__)

@scans_bp.route("/scans/save", methods=["POST"])
@jwt_required()
def save_scan():
    user_id = get_jwt_identity()
    data = request.json

    product_name = data.get("product_name")  # get product name from frontend
    if not product_name:
        return jsonify({"msg": "Product name is required"}), 400

    scan_doc = {
        "user_id": ObjectId(user_id),
        "ingredients": data.get("ingredients", []),
        "product_name": product_name,
        "scanned_at": datetime.utcnow()
    }

    result = scan_collection.insert_one(scan_doc)

    return jsonify({"msg": "Scan result saved", "scan_id": str(result.inserted_id)}), 201




@scans_bp.route("/scans", methods=["GET"])
@jwt_required()
def get_scan_summaries():
    # user_id = get_jwt_identity()
    user_id = ObjectId(get_jwt_identity())
    
    # Fetch only id, product name, and timestamp
    scans = list(scan_collection.find(
        {"user_id": user_id},
        {"_id": 1, "product_name": 1, "scanned_at": 1}
    ))
    
    # Convert ObjectId to string
    for scan in scans:
        scan["_id"] = str(scan["_id"])
    
    return jsonify(scans), 200
