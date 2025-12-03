# embeddings.py - Embedding utilities for product recommendations
from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingEngine:
    """Handles sentence embedding and similarity computations"""
    
    def __init__(self, model_name="sentence-transformers/all-MiniLM-L6-v2"):
        """Initialize the embedding model"""
        self.model = SentenceTransformer(model_name)
        self.embeddings = None
        self.products = None
    
    def build_index(self, products):
        """Build embeddings for all products"""
        self.products = products
        texts = [
            (str(p.get("name", "")) + " " + str(p.get("description", "")) + " " + str(p.get("category", ""))).strip()
            for p in products
        ]
        self.embeddings = self.model.encode(texts, convert_to_numpy=True)
    
    def cosine_similarity(self, vec1, vec2):
        """Compute cosine similarity between two vectors"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        return dot_product / (norm1 * norm2 + 1e-10)
    
    def get_similarities(self, query_vec):
        """Compute similarity scores for all products"""
        if self.embeddings is None:
            return []
        similarities = []
        for emb in self.embeddings:
            sim = self.cosine_similarity(query_vec, emb)
            similarities.append(sim)
        return np.array(similarities)
    
    def encode(self, text):
        """Encode text into embedding vector"""
        return self.model.encode([text], convert_to_numpy=True)[0]
