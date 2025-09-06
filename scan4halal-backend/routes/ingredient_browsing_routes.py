from flask import Blueprint, request, jsonify
# from db import collection
# from db.connection import collection 
from db import collection, users_collection, scan_collection

ingredient_bp = Blueprint("browse", __name__)

@ingredient_bp.route("/ingredients", methods=["GET"])
def get_ingredients():
    data = list(collection.find({}, {"_id": 0}).limit(10))
    return jsonify(data)

@ingredient_bp.route("/ingredients/<name>", methods=["GET"])
def get_ingredient_by_name(name):
    ingredient = collection.find_one({"name": name}, {"_id": 0})
    if ingredient:
        return jsonify(ingredient)
    else:
        return jsonify({"error": "Ingredient not found"}), 404