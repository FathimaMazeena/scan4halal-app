# import json
# from sentence_transformers import SentenceTransformer
# import numpy as np
# # from db.connection import collection
# from db import collection, users_collection, scan_collection
# from sklearn.metrics.pairwise import cosine_similarity
# from rapidfuzz import process, fuzz

# # Load pretrained model
# # model = SentenceTransformer('all-MiniLM-L6-v2')

# # model_path = r"C:\Users\DELL\.cache\huggingface\ingredient_embedding_model"
# # model = SentenceTransformer(model_path)

# def exact_match(ocr_ing, db_names, db_synonyms):
#     """
#     Returns the index of the exact match in DB if found.
#     """
#     # Compare directly since ocr_ing is already preprocessed
#     if ocr_ing in db_names:
#         return db_names.index(ocr_ing)
    
#     for i, syn_list in enumerate(db_synonyms):
#         if ocr_ing in syn_list:
#             return i
    
#     return None  # no exact match


# # def fuzzy_match(ocr_ing, db_names, threshold=95):
# #     """
# #     Returns the index of the closest fuzzy match if score >= threshold.
# #     """
# #     match, score, idx = process.extractOne(
# #         ocr_ing, db_names, scorer=fuzz.ratio
# #     )
# #     if score >= threshold:
# #         return idx
# #     return None

# def fuzzy_match(ocr_ing, db_names, db_synonyms, threshold=90):
#     # Flatten synonyms into candidate list
#     all_candidates = db_names[:]
#     name_to_idx = {name: i for i, name in enumerate(db_names)}

#     for i, syn_list in enumerate(db_synonyms):
#         for syn in syn_list:
#             all_candidates.append(syn)
#             name_to_idx[syn] = i

#     match, score, _ = process.extractOne(ocr_ing, all_candidates, scorer=fuzz.ratio)
    
#     if score >= threshold:
#         return name_to_idx[match]
#     return None



# def load_db_vectors():
#     # Load all DB ingredients and their vectors into memory
#     docs = list(collection.find({}, {"name": 1, "status": 1, "embedding": 1, "synonyms": 1}))
#     names = [d["name"] for d in docs]
#     statuses = [d.get("status", "unknown") for d in docs]
#     vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
#     synonyms = [d.get("synonyms", []) for d in docs]
#     return names, statuses, vecs, synonyms

# db_names, db_statuses, db_vecs, db_synonyms = load_db_vectors()

# # def cosine_similarity(query_vecs, db_vecs, threshold=0.85):
# #     """
# #     query_vecs: np.ndarray (q, dim)
# #     db_vecs: np.ndarray (n, dim)
# #     returns: (q, n) similarity matrix
# #     """
# #     # Normalize to unit length
# #     query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
# #     db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)
    
# #     # Cosine similarity = dot product
# #     sims = np.dot(query_norm, db_norm.T)
# #     best_idx = np.argmax(sims)
# #     if sims[best_idx] >= threshold:
# #         return best_idx
# #     return None

# def cosine_similarity(query_vecs, db_vecs, threshold=1.0):
#     """
#     query_vecs: np.ndarray (q, dim) or (dim,)
#     db_vecs: np.ndarray (n, dim)
#     returns: list of best match indices (or None) for each query
#     """
#     # Handle single vector case
#     if query_vecs.ndim == 1:
#         query_vecs = query_vecs[np.newaxis, :]

#     # Normalize
#     query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
#     db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)

#     # Compute similarities
#     sims = np.dot(query_norm, db_norm.T)  # (q, n)

#     # Best index + score per query
#     best_idx = np.argmax(sims, axis=1)
#     best_scores = np.max(sims, axis=1)

#     # Apply threshold
#     results = [idx if score >= threshold else None for idx, score in zip(best_idx, best_scores)]
#     return results




# # def find_best_match(ocr_text: str, top_k: int = 3):
# #     """Find the closest ingredient(s) for OCR text"""
# #     # Step 1: Embed the OCR text
# #     ocr_vector = embed_text(ocr_text)

# #     # Step 2: Fetch ingredients & their embeddings from DB
# #     items = list(collection.find({}, {"name": 1, "embedding": 1, "status": 1, "description": 1}))
    
# #     # Ensure DB embeddings are numpy arrays
# #     db_vectors = np.array([np.array(item["embedding"]) for item in items])

# #     # Step 3: Compute cosine similarities
# #     sims = cosine_similarity([ocr_vector], db_vectors)[0]

# #     # Step 4: Sort by similarity
# #     ranked = sorted(zip(items, sims), key=lambda x: x[1], reverse=True)

# #     # Step 5: Return top_k matches
# #     return [
# #         {
# #             "ingredient": r[0]["name"],
# #             "status": r[0]["status"],
# #             "description": r[0].get("description", ""),
# #             "similarity": float(r[1])
# #         }
# #         for r in ranked[:top_k]
# #     ]


# # nlp/semantic_utils.py

import json
from sentence_transformers import SentenceTransformer
import numpy as np
from db import collection, users_collection, scan_collection
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process, fuzz

def exact_match(ocr_ing, db_names, db_synonyms):
    """
    Returns the index of the exact match in DB if found.
    Performs case-insensitive comparison.
    """
    ocr_ing_lower = ocr_ing.lower().strip()
    
    # Check against canonical names (convert to lowercase for comparison)
    for i, db_name in enumerate(db_names):
        if ocr_ing_lower == db_name.lower():
            return i
    
    # Check against synonyms (convert each synonym to lowercase for comparison)
    for i, syn_list in enumerate(db_synonyms):
        for syn in syn_list:
            if ocr_ing_lower == syn.lower():
                return i
    
    return None  # no exact match

def fuzzy_match(ocr_ing, db_names, db_synonyms, threshold=50):
    """
    Performs fuzzy matching that is case-insensitive.
    """
    ocr_ing_lower = ocr_ing.lower()
    
    # Build a list of all candidate strings in lowercase
    all_candidates = []
    name_to_idx = {}
    
    # Add canonical names (lowercased)
    for i, name in enumerate(db_names):
        candidate = name.lower()
        all_candidates.append(candidate)
        name_to_idx[candidate] = i
    
    # Add synonyms (lowercased)
    for i, syn_list in enumerate(db_synonyms):
        for syn in syn_list:
            candidate = syn.lower()
            all_candidates.append(candidate)
            name_to_idx[candidate] = i

    # Now perform fuzzy matching on the lowercase candidates
    match, score, _ = process.extractOne(ocr_ing_lower, all_candidates, scorer=fuzz.ratio)
    
    if score >= threshold:
        return name_to_idx[match] # 'match' is the lowercase candidate string
    return None

def load_db_vectors():
    # Load all DB ingredients and their vectors into memory
    docs = list(collection.find({}, {"name": 1, "status": 1, "embedding": 1, "synonyms": 1, "category": 1, "description": 1}))
    names = [d["name"] for d in docs]
    statuses = [d.get("status", "unknown") for d in docs]
    vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
    synonyms = [d.get("synonyms", []) for d in docs]
    category = [d.get("category") for d in docs]
    description = [d.get("description") for d in docs]
    return names, statuses, vecs, synonyms, category, description

db_names, db_statuses, db_vecs, db_synonyms, db_descriptions, db_categories = load_db_vectors()

def cosine_similarity(query_vecs, db_vecs, threshold=0.85):
    """
    query_vecs: np.ndarray (q, dim) or (dim,)
    db_vecs: np.ndarray (n, dim)
    returns: list of best match indices (or None) for each query
    """
    # Handle single vector case
    if query_vecs.ndim == 1:
        query_vecs = query_vecs[np.newaxis, :]

    # Normalize
    query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
    db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)

    # Compute similarities
    sims = np.dot(query_norm, db_norm.T)  # (q, n)

    # Best index + score per query
    best_idx = np.argmax(sims, axis=1)
    best_scores = np.max(sims, axis=1)

    # Apply threshold
    results = [idx if score >= threshold else None for idx, score in zip(best_idx, best_scores)]
    return results

# semantic_utils.py
# import numpy as np
# from rapidfuzz import process, fuzz
# from sentence_transformers import SentenceTransformer
# from db import collection  # Import your collection

# # Load model and database ONCE when module is imported
# model = SentenceTransformer("model/ingredient_embedding_model")

# # Load all database data
# docs = list(collection.find({}, {
#     "name": 1, "status": 1, "embedding": 1, 
#     "synonyms": 1, "category": 1, "description": 1
# }))

# # Store all data in memory
# db_docs = docs
# db_names = [d["name"] for d in docs]
# db_statuses = [d.get("status", "unknown") for d in docs]
# db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
# db_synonyms = [d.get("synonyms", []) for d in docs]

# # Pre-normalize database vectors for faster cosine similarity
# db_vecs_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)

# # Build normalized search index for exact/fuzzy matching
# all_search_targets_lower = []
# index_mapping = {}

# for idx, name in enumerate(db_names):
#     norm_name = name.lower()
#     all_search_targets_lower.append(norm_name)
#     index_mapping[norm_name] = idx

# for idx, syn_list in enumerate(db_synonyms):
#     for syn in syn_list:
#         norm_syn = syn.lower()
#         all_search_targets_lower.append(norm_syn)
#         index_mapping[norm_syn] = idx

# def exact_match(ingredient: str):
#     """Case-insensitive exact matching"""
#     search_term = ingredient.lower().strip()
#     return index_mapping.get(search_term)

# def fuzzy_match(ingredient: str, threshold=80):
#     """Case-insensitive fuzzy matching"""
#     search_term = ingredient.lower().strip()
#     result = process.extractOne(search_term, all_search_targets_lower, scorer=fuzz.ratio)
    
#     if result and result[1] >= threshold:
#         matched_string, score = result
#         return index_mapping[matched_string], score  # ← Return BOTH index AND score
#     return None, 0  # ← Return BOTH None AND 0

# def semantic_match(ingredient: str, threshold=0.85):
#     """Semantic matching using cosine similarity"""
#     # Encode and normalize query
#     query_vec = model.encode([ingredient], convert_to_numpy=True)
#     query_vec_norm = query_vec / (np.linalg.norm(query_vec) + 1e-12)
    
#     # Calculate similarities
#     sims = np.dot(db_vecs_norm, query_vec_norm.T).flatten()
#     best_idx = np.argmax(sims)
#     best_score = sims[best_idx]
    
#     if best_score >= threshold:
#         return best_idx, best_score
#     return None, best_score

# def match_ingredient(ingredient: str, debug=False):
#     """
#     Unified matching function: exact → fuzzy → semantic
#     Returns a complete match result dictionary
#     """
#     try:
#         if debug:
#             print(f"\nProcessing ingredient: '{ingredient}'")
        
#         method = None
#         idx = None
#         score = None
        
#         # 1. Try exact match
#         idx = exact_match(ingredient)
#         if idx is not None:
#             method = "exact"
#             score = 1.0
#             if debug:
#                 print(f"  ✓ Matched via EXACT MATCH to '{db_names[idx]}' (Index: {idx})")
        
#         # 2. Try fuzzy match
#         if idx is None:
#             idx, fuzzy_score = fuzzy_match(ingredient, threshold=80)
#             if idx is not None:
#                 method = "fuzzy"
#                 score = 1.0
#                 if debug:
#                     print(f"  ✓ Matched via FUZZY MATCH to '{db_names[idx]}' (Index: {idx}, Score: {fuzzy_score})")
        
#         # 3. Try semantic match
#         if idx is None:
#             if debug:
#                 print(f"  - No exact or fuzzy match found. Attempting semantic search...")
#             idx, semantic_score = semantic_match(ingredient, threshold=0.85)
#             if idx is not None:
#                 method = "semantic"
#                 score = semantic_score
#                 if debug:
#                     print(f"  ✓ Matched via SEMANTIC MATCH to '{db_names[idx]}' (Index: {idx}, Score: {semantic_score:.4f})")
#             elif debug:
#                 print(f"  ✗ No semantic match found above threshold.")
        
#         # Prepare result
#         if idx is not None:
#             doc = db_docs[idx]
#             return {
#                 "ingredient": ingredient,
#                 "best_match": doc["name"],
#                 "status": doc.get("status", "unknown"),
#                 "score": float(score * 100),  # Convert to percentage
#                 "available_in_db": True,
#                 "match_method": method,
#                 "category": doc.get("category", ""),
#                 "description": doc.get("description", ""),
#                 "synonyms": doc.get("synonyms", [])
#             }
#         else:
#             return {
#                 "ingredient": ingredient,
#                 "best_match": None,
#                 "status": "unknown",
#                 "score": 0,
#                 "available_in_db": False,
#                 "match_method": None,
#                 "category": "",
#                 "description": "",
#                 "synonyms": []
#             }
            
#     except Exception as e:
#         print(f"ERROR processing ingredient '{ingredient}': {str(e)}")
#         # Return a error result instead of crashing
#         return {
#             "ingredient": ingredient,
#             "best_match": None,
#             "status": "error",
#             "score": 0,
#             "available_in_db": False,
#             "match_method": "error",
#             "category": "",
#             "description": f"Error processing: {str(e)}",
#             "synonyms": []
#         }

# # Optional: Keep the original function for backward compatibility
# def cosine_similarity(query_vecs, db_vecs, threshold=0.85):
#     """Legacy function, prefer semantic_match instead"""
#     if query_vecs.ndim == 1:
#         query_vecs = query_vecs[np.newaxis, :]

#     query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
#     db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)

#     sims = np.dot(query_norm, db_norm.T)
#     best_idx = np.argmax(sims, axis=1)
#     best_scores = np.max(sims, axis=1)

#     return [idx if score >= threshold else None for idx, score in zip(best_idx, best_scores)]