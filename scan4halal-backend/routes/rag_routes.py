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
import os
from dotenv import load_dotenv
from db.connection import collection 

rag_bp = Blueprint("rag", __name__)


# Optional: Initialize embedding model if needed
# embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
model = SentenceTransformer("model/ingredient_embedding_model")

# --- Initialize Retriever and Generator ---
retriever = Retriever(collection, model)


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

@rag_bp.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    query = data.get("query")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Step 1: Retrieve relevant matches from DB
    matches = retriever.retrieve(query, top_k=1)

    # If nothing is found, still provide a fallback context
    if not matches:
        matches = [{"name": "unknown", "status": "unknown", "score": 0.0}]

    # Step 2: Use generator to craft a reply (RAG style)
    reply = generator.generate(query, matches)

    return jsonify({
        "query": query,
        "reply": reply,
        "matches": matches
        
    })


@rag_bp.route("/retrieve", methods=["POST"])
def retrieve_endpoint():
    data = request.json
    ingredient = data.get("ingredient")

    if not ingredient:
        return jsonify({"error": "ingredient field is required"}), 400

    matches = retriever.retrieve(ingredient, top_k=1)

    return jsonify({
        "ingredient": ingredient,
        "matches": matches
    })

