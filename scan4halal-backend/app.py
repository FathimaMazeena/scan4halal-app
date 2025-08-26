from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
from sentence_transformers import SentenceTransformer
import re
import numpy as np
from pymongo import MongoClient
from routes.rag_routes import rag_bp

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route("/")
def home():
    return "Scan4Halal Backend Running"


def run_ocr(image_file):
    # Convert Werkzeug FileStorage → PIL Image
    image = Image.open(image_file.stream)
    text = pytesseract.image_to_string(image)
    return text    


def parse_ingredients(ocr_text):
    text = re.sub(r"(?i)ingredients:", "", ocr_text)  # removes 'Ingredients:' (case-insensitive)
    ingredients = [i.strip() for i in re.split(r"[;,]", text) if i.strip()]
    return ingredients

def embed_ocr_ingredients(ingredients, model):
    
    ocr_embeddings = model.encode(ingredients, convert_to_numpy=True)
    return ocr_embeddings


def cosine_similarity(query_vecs, db_vecs):
    """
    query_vecs: np.ndarray (q, dim)
    db_vecs: np.ndarray (n, dim)
    returns: (q, n) similarity matrix
    """
    # Normalize to unit length
    query_norm = query_vecs / (np.linalg.norm(query_vecs, axis=1, keepdims=True) + 1e-12)
    db_norm = db_vecs / (np.linalg.norm(db_vecs, axis=1, keepdims=True) + 1e-12)
    
    # Cosine similarity = dot product
    return np.dot(query_norm, db_norm.T)

 



# Load DB connection
client = MongoClient("mongodb+srv://fathimamazeenamycloudcubicle:QYVlulxdKT8Gh06E@scan4halalcluster0.45pcbto.mongodb.net/?retryWrites=true&w=majority&appName=Scan4HalalCluster0")

db = client["scan4halal_db"]
collection = db["ingredients"]


def load_db_vectors():
    # Load all DB ingredients and their vectors into memory
    docs = list(collection.find({}, {"name": 1, "status": 1, "embedding": 1}))
    names = [d["name"] for d in docs]
    statuses = [d.get("status", "unknown") for d in docs]
    vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
    return names, statuses, vecs

db_names, db_statuses, db_vecs = load_db_vectors()

app.register_blueprint(rag_bp, url_prefix="/rag")

@app.route('/ocr', methods=['POST'])
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


if __name__ == "__main__":
    app.run(debug=True)
