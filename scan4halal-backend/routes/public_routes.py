from flask import Blueprint, request, jsonify
# from db import collection
# from db.connection import collection 
from db import collection, user_submissions
from datetime import datetime


public_bp = Blueprint("ingredients", __name__)

@public_bp.route("/browse", methods=["GET"])
def get_ingredients():
    data = list(collection.find({}, {"_id": 0}).limit(10))
    return jsonify(data)

@public_bp.route("/browse/<name>", methods=["GET"])
def get_ingredient_by_name(name):
    ingredient = collection.find_one({"name": name}, {"_id": 0})
    if ingredient:
        return jsonify(ingredient)
    else:
        return jsonify({"error": "Ingredient not found"}), 404
    


@public_bp.route("/submit", methods=["POST"])
def submit_ingredient():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'ingredient_name' not in data:
            return jsonify({"error": "Ingredient name is required"}), 400
        
        ingredient_name = data['ingredient_name'].strip()
        if not ingredient_name:
            return jsonify({"error": "Ingredient name cannot be empty"}), 400
        
        # Check if this ingredient was already submitted recently (optional)
        recent_submission = user_submissions.find_one({
            "ingredient_name": ingredient_name,
            "created_at": {"$gte": datetime.utcnow().replace(hour=0, minute=0, second=0)}
        })
        
        if recent_submission:
            return jsonify({
                "message": "This ingredient has already been submitted today",
                "success": True,
                "already_submitted": True
            }), 200
        
        # Create submission
        submission = {
            "ingredient_name": ingredient_name,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "user_ip": request.remote_addr
        }
        
        # Insert submission
        result = user_submissions.insert_one(submission)
        
        return jsonify({
            "message": "Ingredient submitted for admin review!",
            "success": True,
            "submission_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500    