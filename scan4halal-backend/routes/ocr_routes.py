# from flask import Blueprint, request, jsonify
# import numpy as np
# from sentence_transformers import SentenceTransformer
# import os
# from dotenv import load_dotenv
# # from db.connection import collection 
# from db import collection, users_collection, scan_collection
# from ocr.ocr_utils import run_ocr, parse_ingredients
# from nlp.semantic_utils import exact_match, fuzzy_match, cosine_similarity, db_vecs, db_names, db_statuses, db_synonyms
# from nlp.embedding_utils import embed_ocr_ingredients

# model = SentenceTransformer("model/ingredient_embedding_model")

# ocr_bp = Blueprint("ocr", __name__)

# @ocr_bp.route('/ocr', methods=['POST'])
# def extract_ingredients():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image provided"}), 400
    
#     image_file = request.files['image']
#     text = run_ocr(image_file)
#     ingredients = parse_ingredients(text)
    
#     ocr_embeddings = embed_ocr_ingredients(ingredients, model)
    
#     results = []
#     for i, ing in enumerate(ingredients):
#         # 1. Exact match
#         idx = exact_match(ing, db_names, db_synonyms)
#         method = "exact"

#         # 2. Fuzzy match
#         if idx is None:
#             idx = fuzzy_match(ing, db_names, db_synonyms, threshold=90)
#             method = "fuzzy" if idx is not None else None

#         # 3. Cosine similarity
#         if idx is None:
#             # cosine_similarity returns a list of indices (even for single ingredient)
#             idx_list = cosine_similarity(np.array([ocr_embeddings[i]]), db_vecs, threshold=0.85)
#             idx = idx_list[0]  # unpack single-element list
#             method = "cosine" if idx is not None else None

#         # Build result
#         if idx is None:
#             results.append({
#                 "ingredient": ing,
#                 "best_match": None,
#                 "status": "unknown",
#                 "score": 0,
#                 "available_in_db": False,
#                 "match_method": None
#             })
#         else:
#             # Compute similarity score for cosine matches
#             if method == "cosine":
#                 emb_norm = ocr_embeddings[i] / (np.linalg.norm(ocr_embeddings[i]) + 1e-12)
#                 db_norm = db_vecs[idx] / (np.linalg.norm(db_vecs[idx]) + 1e-12)
#                 score = float(np.dot(emb_norm, db_norm) * 100)
#             else:
#                 score = 100  # exact or fuzzy match

#             results.append({
#                 "ingredient": ing,
#                 "best_match": db_names[idx],
#                 "status": db_statuses[idx],
#                 "score": round(score, 2),
#                 "available_in_db": True,
#                 "match_method": method
#             })

#     return jsonify({
#         "raw_text": text,
#         "ingredients": ingredients,
#         "matches": results
#     })


from flask import Blueprint, request, jsonify
import numpy as np
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
# from db.connection import collection 
from db import collection, users_collection, scan_collection
from ocr.ocr_utils import run_ocr, parse_ingredients
from nlp.semantic_utils import exact_match, fuzzy_match, cosine_similarity, db_vecs, db_names, db_statuses, db_synonyms, db_categories, db_descriptions
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
    print(f"\n--- Starting Ingredient Matching for {len(ingredients)} ingredients ---")
    for i, ing in enumerate(ingredients):
        print(f"\nProcessing ingredient {i+1}: '{ing}'")
        # 1. Exact match
        idx = exact_match(ing, db_names, db_synonyms)
        method = "exact"
        if idx is not None:
            print(f"  ✓ Matched via EXACT MATCH to '{db_names[idx]}' (Index: {idx})")

        # 2. Fuzzy match
        if idx is None:
            idx = fuzzy_match(ing, db_names, db_synonyms, threshold=90)
            method = "fuzzy" if idx is not None else None
            if idx is not None:
                print(f"  ✓ Matched via FUZZY MATCH to '{db_names[idx]}' (Index: {idx})")

        # 3. Cosine similarity
        if idx is None:
            print(f"  - No exact or fuzzy match found. Attempting semantic search...")
            # cosine_similarity returns a list of indices (even for single ingredient)
            idx_list = cosine_similarity(np.array([ocr_embeddings[i]]), db_vecs, threshold=0.85)
            idx = idx_list[0]  # unpack single-element list
            method = "cosine" if idx is not None else None
            if idx is not None:
                # Compute the score for printing
                emb_norm = ocr_embeddings[i] / (np.linalg.norm(ocr_embeddings[i]) + 1e-12)
                db_norm = db_vecs[idx] / (np.linalg.norm(db_vecs[idx]) + 1e-12)
                score = float(np.dot(emb_norm, db_norm))
                print(f"  ✓ Matched via COSINE SIMILARITY to '{db_names[idx]}' (Index: {idx}, Score: {score:.4f})")
            else:
                print(f"  ✗ No semantic match found above threshold.")

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
                "match_method": method,
                "category": db_categories[idx],
                "description": db_descriptions[idx],
                "synonyms": db_synonyms[idx]
            })
    print("\n--- Matching Complete ---\n")
    return jsonify({
        "raw_text": text,
        "ingredients": ingredients,
        "matches": results
    })

# ocr_routes.py
# from flask import Blueprint, request, jsonify
# from ocr.ocr_utils import run_ocr, parse_ingredients
# from nlp.semantic_utils import match_ingredient  # Import the unified matcher

# ocr_bp = Blueprint("ocr", __name__)

# # ocr_routes.py
# @ocr_bp.route('/ocr', methods=['POST'])
# def extract_ingredients():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image provided"}), 400
    
#     try:
#         image_file = request.files['image']
#         text = run_ocr(image_file)
#         ingredients = parse_ingredients(text)
        
#         # Print the header
#         print(f"\n--- Starting Ingredient Matching for {len(ingredients)} ingredients ---")
        
#         # Use the unified matching function for each ingredient with debug=True
#         matches = []
#         for i, ing in enumerate(ingredients):
#             try:
#                 result = match_ingredient(ing, debug=True)
#                 matches.append(result)
#             except Exception as e:
#                 print(f"CRITICAL ERROR processing ingredient '{ing}': {str(e)}")
#                 # Add error result to prevent complete failure
#                 matches.append({
#                     "ingredient": ing,
#                     "best_match": None,
#                     "status": "error",
#                     "score": 0,
#                     "available_in_db": False,
#                     "match_method": "error",
#                     "category": "",
#                     "description": f"Critical error: {str(e)}",
#                     "synonyms": []
#                 })
        
#         print("\n--- Matching Complete ---\n")
        
#         return jsonify({
#             "raw_text": text,
#             "ingredients": ingredients,
#             "matches": matches
#         })
        
#     except Exception as e:
#         print(f"OCR ENDPOINT ERROR: {str(e)}")
#         return jsonify({"error": f"Internal server error: {str(e)}"}), 500