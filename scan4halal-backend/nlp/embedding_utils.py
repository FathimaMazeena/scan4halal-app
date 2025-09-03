import json
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
import numpy as np


load_dotenv()    
model = SentenceTransformer(os.getenv("EMBEDDING_MODEL"))

with open('data/ingredients_final.json', 'r', encoding='utf-8') as f:
    ingredients = json.load(f)




# model = SentenceTransformer("model/ingredient_embedding_model")


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

# def embed_text(text: str) -> np.ndarray:
#     """Generate embedding for a single text string"""
#     return model.encode([text], convert_to_numpy=True)[0]    

# Generate embeddings
embeddings = model.encode(texts, convert_to_numpy=True)

# Save to JSON file with embeddings
for i, item in enumerate(ingredients):
    item['embedding'] = embeddings[i].tolist()

# Save updated dataset
with open('embedded_dataset3.json', 'w', encoding='utf-8') as f:
    json.dump(ingredients, f, indent=2)    


def embed_ocr_ingredients(ingredients, model):
    
    ocr_embeddings = model.encode(ingredients, convert_to_numpy=True)
    return ocr_embeddings
