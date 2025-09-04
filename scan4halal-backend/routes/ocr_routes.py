from flask import Blueprint, request, jsonify
import numpy as np
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
from db.connection import collection 
from ocr.ocr_utils import run_ocr, parse_ingredients
from nlp.semantic_utils import exact_match, fuzzy_match, cosine_similarity, db_vecs, db_names, db_statuses, db_synonyms
from nlp.embedding_utils import embed_ocr_ingredients

model = SentenceTransformer("model/ingredient_embedding_model")

ocr_bp = Blueprint("ocr", __name__)

@ocr_bp.route('/ocr', methods=['POST'])
def extract_ingredients():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    image_file = request.files['image']
    text = run_ocr(image_file)
    ingredients = parse_ingredients(text)
    
    ocr_embeddings = embed_ocr_ingredients(ingredients, model)
    
    results = []
    for i, ing in enumerate(ingredients):
        # 1. Exact match
        idx = exact_match(ing, db_names, db_synonyms)
        method = "exact"

        # 2. Fuzzy match
        if idx is None:
            idx = fuzzy_match(ing, db_names, threshold=90)
            method = "fuzzy" if idx is not None else None

        # 3. Cosine similarity
        if idx is None:
            # cosine_similarity returns a list of indices (even for single ingredient)
            idx_list = cosine_similarity(np.array([ocr_embeddings[i]]), db_vecs, threshold=0.85)
            idx = idx_list[0]  # unpack single-element list
            method = "cosine" if idx is not None else None

        # Build result
        if idx is None:
            results.append({
                "ingredient": ing,
                "best_match": None,
                "status": "unknown",
                "score": 0,
                "available_in_db": False,
                "match_method": None
            })
        else:
            # Compute similarity score for cosine matches
            if method == "cosine":
                emb_norm = ocr_embeddings[i] / (np.linalg.norm(ocr_embeddings[i]) + 1e-12)
                db_norm = db_vecs[idx] / (np.linalg.norm(db_vecs[idx]) + 1e-12)
                score = float(np.dot(emb_norm, db_norm) * 100)
            else:
                score = 100  # exact or fuzzy match

            results.append({
                "ingredient": ing,
                "best_match": db_names[idx],
                "status": db_statuses[idx],
                "score": round(score, 2),
                "available_in_db": True,
                "match_method": method
            })

    return jsonify({
        "raw_text": text,
        "ingredients": ingredients,
        "matches": results
    })