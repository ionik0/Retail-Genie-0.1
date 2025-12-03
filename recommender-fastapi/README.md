# OmniSell Recommender Service (FastAPI)

AI-powered product recommendation engine for **OmniSell – Carlsberg**, an autonomous AI sales agent for EY Techathon 6.0.

## Features

✅ **Sentence Transformer Embeddings** — Advanced NLP-based similarity search  
✅ **Real-time Recommendations** — Ultra-fast product suggestions  
✅ **Smart Filtering** — Price, category, and keyword-based filtering  
✅ **Production-ready** — Scalable FastAPI microservice  
✅ **Cloud-ready** — Works with MongoDB for persistence  

## Tech Stack

- **FastAPI** — Modern Python web framework
- **Sentence Transformers** — Semantic search embeddings
- **NumPy** — Fast numerical computations
- **Uvicorn** — ASGI server
- **Pydantic** — Data validation

## Installation

### Prerequisites
- Python 3.9+
- pip

### Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Create environment file:**
```bash
copy .env.example .env
```

3. **Run the service:**
```bash
uvicorn main:app --reload --port 8000
```

The service will start on `http://localhost:8000`

## API Endpoints

### 1. Health Check
```
GET /
```
Response:
```json
{
  "status": "healthy",
  "service": "OmniSell Recommender",
  "version": "1.0.0"
}
```

### 2. Get Recommendations
```
POST /recommend
```
Request body:
```json
{
  "query": "show me jeans under 2000",
  "top_k": 5,
  "min_price": null,
  "max_price": 2000,
  "category": null
}
```

Response:
```json
{
  "results": [
    {
      "id": 1,
      "name": "Blue Denim Jeans",
      "price": 1599,
      "category": "jeans",
      "image": "https://...",
      "description": "Classic blue denim jeans"
    }
  ],
  "query_used": "show me jeans under 2000",
  "count": 5
}
```

### 3. Get All Products
```
GET /products
```

### 4. Get Product by ID
```
GET /products/{product_id}
```

## How It Works

1. **User Query** → `POST /recommend`
2. **Embedding** → Query converted to vector using Sentence Transformers
3. **Similarity Search** → Compute cosine similarity with all products
4. **Ranking** → Sort by relevance score
5. **Filtering** → Apply price/category filters
6. **Response** → Return top-k products

## Testing

### Using curl:
```bash
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"jeans under 2000","top_k":3}'
```

### Using Python:
```python
import requests

response = requests.post(
    "http://localhost:8000/recommend",
    json={
        "query": "jeans under 2000",
        "top_k": 3,
        "max_price": 2000
    }
)
print(response.json())
```

## Deployment

### Local Development
```bash
uvicorn main:app --reload --port 8000
```

### Production (Gunicorn + Uvicorn)
```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker
```bash
docker build -t omnisell-recommender .
docker run -p 8000:8000 omnisell-recommender
```

## Environment Variables

```
PORT=8000                                    # Service port
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2  # Embedding model
PRODUCTS_JSON=products.json                  # Products data file
MONGO_URI=                                   # Optional MongoDB connection
DB_NAME=carlsberg                            # MongoDB database name
```

## Performance

- **Model Load Time:** ~2-3 seconds
- **First Query:** ~100-200ms (includes embedding)
- **Subsequent Queries:** ~50-100ms
- **Throughput:** 100+ recommendations/second

## Architecture

```
User Query
    ↓
FastAPI Endpoint (/recommend)
    ↓
Query Embedding (Sentence Transformer)
    ↓
Similarity Computation (NumPy)
    ↓
Filtering & Ranking
    ↓
JSON Response
```

## Team

Built with ❤️ by **Team Carlsberg** for EY Techathon 6.0

## License

Proprietary - EY Techathon 6.0
