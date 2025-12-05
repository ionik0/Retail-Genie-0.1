# main.py - FastAPI Recommender Service
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from models.recommender_model import RecommenderModel

# Load environment variables
load_dotenv()

# Initialize recommender model early
recommender = RecommenderModel(products_json_path="products.json")

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("✅ OmniSell Recommender Service Started")
    print(f"📦 Loaded {len(recommender.products)} products")
    print(f"🧠 Using model: sentence-transformers/all-MiniLM-L6-v2")
    yield
    # Shutdown
    print("🛑 OmniSell Recommender Service Stopped")

# Initialize FastAPI app
app = FastAPI(
    title="Retail-Genie-protoype",
    description="AI-powered product recommendation engine",
    version="1.0.0",
    lifespan=lifespan
)

# Pydantic request model
class RecommendationQuery(BaseModel):
    query: str
    top_k: Optional[int] = 5
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    category: Optional[str] = None

# Pydantic response model
class Product(BaseModel):
    id: int
    name: str
    price: int
    category: str
    image: str
    description: str

class RecommendationResponse(BaseModel):
    results: List[Product]
    query_used: str
    count: int

# Health check endpoint
@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "OmniSell Recommender",
        "version": "1.0.0"
    }

# Main recommendation endpoint
@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(query: RecommendationQuery):
    """
    Get product recommendations based on user query
    
    Args:
        query: Search query and filters
    
    Returns:
        List of recommended products
    """
    try:
        # Prepare filters
        filters = {}
        if query.min_price is not None:
            filters["min_price"] = query.min_price
        if query.max_price is not None:
            filters["max_price"] = query.max_price
        if query.category:
            filters["category"] = query.category
        
        # Get recommendations
        results = recommender.recommend(
            query=query.query,
            top_k=query.top_k,
            filters=filters
        )
        
        return RecommendationResponse(
            results=results,
            query_used=query.query,
            count=len(results)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

# Search endpoint (alias for recommend)
@app.post("/search")
def search_products(query: RecommendationQuery):
    """Alternative search endpoint"""
    return get_recommendations(query)

# Get all products endpoint
@app.get("/products")
def get_all_products():
    """Get all available products"""
    return {
        "products": recommender.products,
        "total": len(recommender.products)
    }

# Get product by ID endpoint
@app.get("/products/{product_id}")
def get_product(product_id: int):
    """Get specific product by ID"""
    for product in recommender.products:
        if product.get("_id") == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")

# Startup event (replaced with lifespan)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
