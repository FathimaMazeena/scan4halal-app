# from flask import Blueprint, request, jsonify
# from rag.retriever import Retriever
# from rag.generator import ExplanationGenerator


# rag_bp = Blueprint("rag", __name__)

# # Initialize shared services
# retriever = Retriever(db={})   # Replace with real DB/vectorstore
# generator = ExplanationGenerator()

# @rag_bp.route("/explain", methods=["POST"])
# def explain_ingredient():
#     data = request.get_json()
#     ingredient = data["ingredient"]

#     matches = retriever.retrieve(ingredient, top_k=1)
#     context = matches if matches else [{"name": ingredient, "status": "unknown", "score": 0.0}]

#     explanation = generator.generate(ingredient, context)

#     return jsonify({
#         "ingredient": ingredient,
#         "explanation": explanation
#     })



from flask import Blueprint, request, jsonify
from rag.retriever import Retriever
from rag.generator import ExplanationGenerator
from pymongo import MongoClient
import numpy as np
from sentence_transformers import SentenceTransformer

rag_bp = Blueprint("rag", __name__)

# --- MongoDB setup ---
client = MongoClient("mongodb+srv://fathimamazeenamycloudcubicle:QYVlulxdKT8Gh06E@scan4halalcluster0.45pcbto.mongodb.net/?retryWrites=true&w=majority&appName=Scan4HalalCluster0")
db = client["scan4halal_db"]
collection = db["ingredients"]


# Optional: Initialize embedding model if needed
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# --- Initialize Retriever and Generator ---
retriever = Retriever(collection, embedding_model)


generator = ExplanationGenerator()



# Initialize retriever with both collection and embedding model



@rag_bp.route("/explain", methods=["POST"])
def explain_ingredient():
    data = request.get_json()
    ingredient = data.get("ingredient")
    if not ingredient:
        return jsonify({"error": "No ingredient provided"}), 400

    # Retrieve top match(es) from MongoDB
    matches = retriever.retrieve(ingredient, top_k=1)
    context = matches if matches else [{"name": ingredient, "status": "unknown", "score": 0.0}]

    # Generate explanation via Hugging Face API
    explanation = generator.generate(ingredient, context)

    return jsonify({
        "ingredient": ingredient,
        "explanation": explanation,
        "matches": context
    })
