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

# import numpy as np

# class Retriever:
#     def __init__(self, collection, embedding_model):
#         """
#         collection: pymongo collection with documents having 'name', 'status', 'embedding'
#         embedding_model: SentenceTransformer model
#         """
#         self.collection = collection
#         self.embedding_model = embedding_model

#         # Load all DB ingredients and embeddings into memory
#         # docs = list(self.collection.find({}, {"name": 1, "status": 1, "embedding": 1}))
#         docs = list(self.collection.find({}, {
#             "name": 1,
#             "status": 1,
#             "embedding": 1,
#             # 👇 add the extra fields here
#             "synonyms": 1,
#             "category": 1,
#             "description": 1
#         }))
#         # self.db_names = [d["name"] for d in docs]
#         # self.db_statuses = [d.get("status", "unknown") for d in docs]
#         # self.db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)



#         # # Store all docs for reference (includes synonyms, category, description)
#         # self.db_docs = docs

#         self.db_docs = docs
#         self.db_names = [d["name"] for d in docs]
#         self.db_statuses = [d.get("status", "unknown") for d in docs]
#         self.db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)

    
#     def retrieve(self, ingredient: str, top_k: int = 3):
#         """
#         ingredient: string to search for
#         Returns top_k closest matches from MongoDB based on cosine similarity
#         """
#         # Encode ingredient to vector
#         ingredient_embedding = self.embedding_model.encode([ingredient], convert_to_numpy=True)[0]

#         # Normalize query and DB vectors
#         query_vec = ingredient_embedding / (np.linalg.norm(ingredient_embedding) + 1e-12)
#         db_norm = self.db_vecs / (np.linalg.norm(self.db_vecs, axis=1, keepdims=True) + 1e-12)

#         # Cosine similarity
#         sims = np.dot(db_norm, query_vec.T).flatten()

#         # Get top_k matches
#         top_idx = sims.argsort()[-top_k:][::-1]

#         matches = []
#         for idx in top_idx:
#             matches.append({
#                 "name": self.db_docs[idx]["name"],
#                 "status": self.db_docs[idx].get("status", "unknown"),
#                 "score": float(sims[idx]),
#                 "synonyms": self.db_docs[idx].get("synonyms", []),
#                 "category": self.db_docs[idx].get("category", ""),
#                 "description": self.db_docs[idx].get("description", "")
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
        docs = list(self.collection.find({}, {
            "name": 1,
            "status": 1,
            "embedding": 1,
            "synonyms": 1,
            "category": 1,
            "description": 1
        }))
        
        self.db_docs = docs
        self.db_names = [d["name"] for d in docs]
        self.db_statuses = [d.get("status", "unknown") for d in docs]
        self.db_vecs = np.array([d["embedding"] for d in docs], dtype=np.float32)
        
        # ✅ NEW: Pre-normalize everything for exact and fuzzy matching
        self._build_normalized_search_index()

    def _build_normalized_search_index(self):
        """
        Builds normalized (lowercase) versions of all names and synonyms
        for exact and fuzzy matching.
        """
        self.db_names_lower = []  # Lowercase canonical names
        self.all_search_targets_lower = []  # All possible search targets (names + synonyms)
        self.index_mapping = {}  # Maps lowercase target -> original db index
        
        for idx, doc in enumerate(self.db_docs):
            # Normalize and store canonical name
            norm_name = doc["name"].lower()
            self.db_names_lower.append(norm_name)
            self._add_to_search_index(norm_name, idx)
            
            # Normalize and store all synonyms
            for synonym in doc.get("synonyms", []):
                norm_synonym = synonym.lower()
                self._add_to_search_index(norm_synonym, idx)
    
    def _add_to_search_index(self, normalized_term, original_index):
        """Helper method to add terms to search index and mapping"""
        self.all_search_targets_lower.append(normalized_term)
        self.index_mapping[normalized_term] = original_index
    
    def exact_match(self, ingredient: str):
        """
        Checks for an exact match against pre-normalized names and synonyms.
        Returns the index of the match in the original db, or None.
        """
        search_term = ingredient.lower().strip()
        return self.index_mapping.get(search_term)  # Returns None if not found
    
    def fuzzy_match(self, ingredient: str, threshold: int = 90):
        """
        Checks for a fuzzy match against pre-normalized names and synonyms.
        Returns the index of the match in the original db, or None.
        """
        from fuzzywuzzy import process
        
        search_term = ingredient.lower().strip()
        
        # Find best match in pre-normalized list
        result = process.extractOne(search_term, self.all_search_targets_lower)
        
        if result and result[1] >= threshold:
            matched_string, score = result
            # Get the original index from our mapping
            return self.index_mapping[matched_string]
        
        return None

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
                "name": self.db_docs[idx]["name"],
                "status": self.db_docs[idx].get("status", "unknown"),
                "score": float(sims[idx]),
                "synonyms": self.db_docs[idx].get("synonyms", []),
                "category": self.db_docs[idx].get("category", ""),
                "description": self.db_docs[idx].get("description", "")
            })
        return matches