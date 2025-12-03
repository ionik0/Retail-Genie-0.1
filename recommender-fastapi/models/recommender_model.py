# recommender_model.py - Core recommendation logic
import json
from utils.embeddings import EmbeddingEngine

class RecommenderModel:
    """AI-powered product recommendation engine"""
    
    def __init__(self, products_json_path="products.json"):
        """Initialize recommender with products"""
        self.engine = EmbeddingEngine()
        self.products = self._load_products(products_json_path)
        self.engine.build_index(self.products)
    
    def _load_products(self, path):
        """Load products from JSON file"""
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"[ERROR] Failed to load products: {e}")
            return []
    
    def recommend(self, query, top_k=5, filters=None):
        """
        Get top-k product recommendations based on query
        
        Args:
            query: User search query
            top_k: Number of recommendations to return
            filters: Dict with optional min_price, max_price, category
        
        Returns:
            List of recommended products
        """
        filters = filters or {}
        
        # Encode query
        query_vec = self.engine.encode(query.lower())
        
        # Get similarity scores
        similarities = self.engine.get_similarities(query_vec)
        
        # Get top indices
        top_indices = similarities.argsort()[::-1]
        
        results = []
        for idx in top_indices:
            product = self.products[idx]
            
            # Apply filters
            if filters.get("category") and product.get("category") != filters.get("category"):
                continue
            
            if filters.get("min_price") and product.get("price", 0) < filters.get("min_price"):
                continue
            
            if filters.get("max_price") and product.get("price", 0) > filters.get("max_price"):
                continue
            
            results.append({
                "id": product.get("_id"),
                "name": product.get("name"),
                "price": product.get("price"),
                "category": product.get("category"),
                "image": product.get("image"),
                "description": product.get("description")
            })
            
            if len(results) >= top_k:
                break
        
        # Fallback: return top 3 if no results
        if not results:
            results = [
                {
                    "id": p.get("_id"),
                    "name": p.get("name"),
                    "price": p.get("price"),
                    "category": p.get("category"),
                    "image": p.get("image"),
                    "description": p.get("description")
                }
                for p in self.products[:3]
            ]
        
        return results
