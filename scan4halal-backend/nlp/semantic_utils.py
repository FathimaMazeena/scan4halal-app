import json
from sentence_transformers import SentenceTransformer
import numpy as np
from db.connection import collection
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
with open('data/ingredients_final.json', 'r', encoding='utf-8') as f:
    ingredients = json.load(f)


# Load pretrained model
# model = SentenceTransformer('all-MiniLM-L6-v2')

# model_path = r"C:\Users\DELL\.cache\huggingface\ingredient_embedding_model"
# model = SentenceTransformer(model_path)

model = SentenceTransformer("model/ingredient_embedding_model")


# Prepare texts to embed
texts = []
for item in ingredients:
    base = item['name']
    synonyms = item.get('synonyms', [])
    # description = item.get('description', '')
    # category = item.get('category', '')
    # status = item.get('status', '')


    # You can embed name + synonyms + explanation as one block
    # combined_text = f"{base}. Also known as {', '.join(synonyms)} is {status}. {description}"
    combined_text = f"{base} {' '.join(synonyms) if synonyms else ''}"

    texts.append(combined_text)

def embed_text(text: str) -> np.ndarray:
    """Generate embedding for a single text string"""
    return model.encode([text], convert_to_numpy=True)[0]    

# Generate embeddings
embeddings = model.encode(texts, convert_to_numpy=True)

# Save to JSON file with embeddings
for i, item in enumerate(ingredients):
    item['embedding'] = embeddings[i].tolist()

# Save updated dataset
with open('embedded_dataset3.json', 'w', encoding='utf-8') as f:
    json.dump(ingredients, f, indent=2)    



def find_best_match(ocr_text: str, top_k: int = 3):
    """Find the closest ingredient(s) for OCR text"""
    # Step 1: Embed the OCR text
    ocr_vector = embed_text(ocr_text)

    # Step 2: Fetch ingredients & their embeddings from DB
    items = list(collection.find({}, {"name": 1, "embedding": 1, "status": 1, "description": 1}))
    
    # Ensure DB embeddings are numpy arrays
    db_vectors = np.array([np.array(item["embedding"]) for item in items])

    # Step 3: Compute cosine similarities
    sims = cosine_similarity([ocr_vector], db_vectors)[0]

    # Step 4: Sort by similarity
    ranked = sorted(zip(items, sims), key=lambda x: x[1], reverse=True)

    # Step 5: Return top_k matches
    return [
        {
            "ingredient": r[0]["name"],
            "status": r[0]["status"],
            "description": r[0].get("description", ""),
            "similarity": float(r[1])
        }
        for r in ranked[:top_k]
    ]