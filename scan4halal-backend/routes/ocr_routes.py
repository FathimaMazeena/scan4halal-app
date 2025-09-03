from flask import Blueprint, request, jsonify
import numpy as np
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
from db.connection import collection 
from ocr.ocr_utils import run_ocr, parse_ingredients
from nlp.semantic_utils import cosine_similarity, db_vecs, db_names, db_statuses
from nlp.embedding_utils import embed_ocr_ingredients

model = SentenceTransformer("model/ingredient_embedding_model")

ocr_bp = Blueprint("ocr", __name__)

@ocr_bp.route('/ocr', methods=['POST'])
def extract_ingredients():

    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    image_file = request.files['image']  # FileStorage
    text = run_ocr(image_file)   

    ingredients = parse_ingredients(text)  


    ocr_embeddings = embed_ocr_ingredients(ingredients, model)
    
    print(ocr_embeddings.shape) 
    print(ingredients)   

    # --- cosine similarity ---
    sims = cosine_similarity(ocr_embeddings, db_vecs)  # (num_ing, num_db)

    # For each OCR’d ingredient, get best match
    results = []
    for i, ing in enumerate(ingredients):
        best_idx = np.argmax(sims[i])
        best_score = float(sims[i][best_idx])
        results.append({
            "ingredient": ing,
            "best_match": db_names[best_idx],
            "status": db_statuses[best_idx],
            "score": round(best_score, 3)
        })

    print(results)    

    return jsonify({
        "raw_text": text,
        "ingredients": ingredients,
        "ocr_embeddings": ocr_embeddings.tolist(), # numpy array → JSON serializable
        "matches": results

    })
