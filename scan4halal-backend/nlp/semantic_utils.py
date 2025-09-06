import json
from sentence_transformers import SentenceTransformer
import numpy as np
# from db.connection import collection
from db import collection, users_collection, scan_collection
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process, fuzz

# Load pretrained model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# model_path = r"C:\Users\DELL\.cache\huggingface\ingredient_embedding_model"
# model = SentenceTransformer(model_path)

def exact_match(ocr_ing, db_names, db_synonyms):
    """
    Returns the index of the exact match in DB if found.
    """
    # Compare directly since ocr_ing is already preprocessed
    if ocr_ing in db_names:
        return db_names.index(ocr_ing)
    
    for i, syn_list in enumerate(db_synonyms):
        if ocr_ing in syn_list:
            return i
    
    return None  # no exact match


def fuzzy_match(ocr_ing, db_names, threshold=95):
    """
    Returns the index of the closest fuzzy match if score >= threshold.
    """
    match, score, idx = process.extractOne(
        ocr_ing, db_names, scorer=fuzz.ratio
    )
    if score >= threshold:
        return idx
    return None




def load_db_vectors():
    # Load all DB ingredients and their vectors into memory
    docs = list(collection.find({}, {"name": 1, "status": 1, "embedding": 1, "synonyms": 1}))
    names = [d["name"] for d in docs]
    statuses = [d.get("status", "unknown") for d in docs]
    vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
    synonyms = [d.get("synonyms", []) for d in docs]
    return names, statuses, vecs, synonyms

db_names, db_statuses, db_vecs, db_synonyms = load_db_vectors()

# def cosine_similarity(query_vecs, db_vecs, threshold=0.85):
#     """
#     query_vecs: np.ndarray (q, dim)
#     db_vecs: np.ndarray (n, dim)
#     returns: (q, n) similarity matrix
#     """
#     # Normalize to unit length
#     query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
#     db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)
    
#     # Cosine similarity = dot product
#     sims = np.dot(query_norm, db_norm.T)
#     best_idx = np.argmax(sims)
#     if sims[best_idx] >= threshold:
#         return best_idx
#     return None

def cosine_similarity(query_vecs, db_vecs, threshold=1.0):
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




# def find_best_match(ocr_text: str, top_k: int = 3):
#     """Find the closest ingredient(s) for OCR text"""
#     # Step 1: Embed the OCR text
#     ocr_vector = embed_text(ocr_text)

#     # Step 2: Fetch ingredients & their embeddings from DB
#     items = list(collection.find({}, {"name": 1, "embedding": 1, "status": 1, "description": 1}))
    
#     # Ensure DB embeddings are numpy arrays
#     db_vectors = np.array([np.array(item["embedding"]) for item in items])

#     # Step 3: Compute cosine similarities
#     sims = cosine_similarity([ocr_vector], db_vectors)[0]

#     # Step 4: Sort by similarity
#     ranked = sorted(zip(items, sims), key=lambda x: x[1], reverse=True)

#     # Step 5: Return top_k matches
#     return [
#         {
#             "ingredient": r[0]["name"],
#             "status": r[0]["status"],
#             "description": r[0].get("description", ""),
#             "similarity": float(r[1])
#         }
#         for r in ranked[:top_k]
#     ]


