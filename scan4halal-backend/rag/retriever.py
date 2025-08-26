# import numpy as np

# class IngredientRetriever:
#     def __init__(self, db_names, db_statuses, db_vecs, model):
#         self.db_names = db_names
#         self.db_statuses = db_statuses
#         self.db_vecs = db_vecs
#         self.model = model

#     def embed_query(self, query: str):
#         """Convert query into embedding"""
#         return self.model.encode([query], convert_to_numpy=True)[0]

#     def retrieve(self, query: str, top_k: int = 3):
#         """Return top-k similar docs"""
#         query_vec = self.embed_query(query)
#         scores = np.dot(self.db_vecs, query_vec) / (
#             np.linalg.norm(self.db_vecs, axis=1) * np.linalg.norm(query_vec)
#         )
#         top_idx = np.argsort(scores)[::-1][:top_k]
#         return [
#             {"name": self.db_names[i], "status": self.db_statuses[i], "score": float(scores[i])}
#             for i in top_idx
#         ]
    

# class Retriever:
#     def __init__(self, db):
#         self.db = db

#     def retrieve(self, ingredient: str, top_k: int = 3):
#         # Example logic — depends on DB
#         matches = self.db.search(ingredient, top_k=top_k)
#         return matches


# import numpy as np

# class Retriever:
#     def __init__(self, collection):
#         """
#         collection: pymongo collection with documents having 'name', 'status', 'embedding'
#         """
#         self.collection = collection
#         # Load all DB ingredients and embeddings into memory for fast retrieval
#         docs = list(self.collection.find({}, {"name": 1, "status": 1, "embedding": 1}))
#         self.db_docs = docs
#         self.db_names = [d["name"] for d in docs]
#         self.db_statuses = [d.get("status", "unknown") for d in docs]
#         self.db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)

#     def retrieve(self, ingredient_embedding, top_k: int = 3):
#         """
#         ingredient_embedding: np.ndarray of shape (1, dim)
#         Returns top_k closest matches from MongoDB based on cosine similarity
#         """
#         # Normalize
#         query_vec = ingredient_embedding / (np.linalg.norm(ingredient_embedding) + 1e-12)
#         db_norm = self.db_vecs / (np.linalg.norm(self.db_vecs, axis=1, keepdims=True) + 1e-12)

#         sims = np.dot(db_norm, query_vec.T).flatten()  # cosine similarity
#         top_idx = sims.argsort()[-top_k:][::-1]  # indices of top_k

#         matches = []
#         for idx in top_idx:
#             matches.append({
#                 "name": self.db_names[idx],
#                 "status": self.db_statuses[idx],
#                 "score": float(sims[idx])
#             })
#         return matches

import numpy as np

class Retriever:
    def __init__(self, collection, embedding_model):
        """
        collection: pymongo collection with documents having 'name', 'status', 'embedding'
        embedding_model: SentenceTransformer model
        """
        self.collection = collection
        self.embedding_model = embedding_model

        # Load all DB ingredients and embeddings into memory
        docs = list(self.collection.find({}, {"name": 1, "status": 1, "embedding": 1}))
        self.db_names = [d["name"] for d in docs]
        self.db_statuses = [d.get("status", "unknown") for d in docs]
        self.db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)

    def retrieve(self, ingredient: str, top_k: int = 3):
        """
        ingredient: string to search for
        Returns top_k closest matches from MongoDB based on cosine similarity
        """
        # Encode ingredient to vector
        ingredient_embedding = self.embedding_model.encode([ingredient], convert_to_numpy=True)[0]

        # Normalize query and DB vectors
        query_vec = ingredient_embedding / (np.linalg.norm(ingredient_embedding) + 1e-12)
        db_norm = self.db_vecs / (np.linalg.norm(self.db_vecs, axis=1, keepdims=True) + 1e-12)

        # Cosine similarity
        sims = np.dot(db_norm, query_vec.T).flatten()

        # Get top_k matches
        top_idx = sims.argsort()[-top_k:][::-1]

        matches = []
        for idx in top_idx:
            matches.append({
                "name": self.db_names[idx],
                "status": self.db_statuses[idx],
                "score": float(sims[idx])
            })
        return matches
