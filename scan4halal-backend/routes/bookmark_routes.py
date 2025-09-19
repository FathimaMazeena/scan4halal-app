from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import users_collection
from datetime import datetime
from bson import ObjectId

bookmark_bp = Blueprint('bookmarks', __name__)

# Bookmark an ingredient
@bookmark_bp.route('/bookmark', methods=['POST'])
@jwt_required()
def bookmark_ingredient():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data or 'ingredient' not in data:
            return jsonify({"error": "Ingredient data is required"}), 400
        
        ingredient_data = data['ingredient']
        
        
        # Add to user's bookmarks array
        new_bookmark = {
            "ingredient": ingredient_data,
            "created_at": datetime.utcnow(),
        }
        
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"bookmarks": new_bookmark}}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": "Ingredient bookmarked successfully"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get user's bookmarks
@bookmark_bp.route('/bookmarks', methods=['GET'])
@jwt_required()
def get_bookmarks():
    try:
        user_id = get_jwt_identity()
        
        user = users_collection.find_one(
            {"_id": ObjectId(user_id)},
            {"bookmarks": 1}
        )
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        bookmarks = user.get('bookmarks', [])
        
        # Convert ObjectId and datetime for JSON serialization
        for bookmark in bookmarks:
            if 'created_at' in bookmark and isinstance(bookmark['created_at'], datetime):
                bookmark['created_at'] = bookmark['created_at'].isoformat()
        
        return jsonify({
            "bookmarks": bookmarks,
            "total": len(bookmarks)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Remove bookmark
@bookmark_bp.route('/bookmark', methods=['DELETE'])
@jwt_required()
def remove_bookmark():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        if not data or 'ingredient_name' not in data:
            return jsonify({"error": "Ingredient name is required"}), 400
        
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"bookmarks": {"ingredient.ingredient": data['ingredient_name']}}}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Bookmark not found"}), 404
        
        return jsonify({"message": "Bookmark removed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
