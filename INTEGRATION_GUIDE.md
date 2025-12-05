# Retail Genie - Full Stack Integration Setup Guide

## Architecture Overview

The Retail Genie system consists of three main services that communicate with each other:

1. **Frontend (React/Vite)** - `frontend/` - Port 5173 (dev) or 3000 (prod)
2. **Orchestrator (Node.js/Express)** - `orchestrator-node/` - Port 5000
3. **Recommender (Python/FastAPI)** - `recommender-fastapi/` - Port 8000

### Data Flow
```
Frontend (Chatbot) 
    ↓ (HTTP POST /message)
Orchestrator (Message Controller)
    ↓ (HTTP POST /recommend)
Recommender (FastAPI)
    ↓ (Returns products)
Orchestrator (processes & sends offers)
    ↓ (Returns recommendations + offers)
Frontend (displays to user)
```

## Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+ and pip
- **Git**

## Installation Steps

### 1. Setup Recommender (Python/FastAPI)

```bash
# Navigate to recommender directory
cd recommender-fastapi

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Windows CMD:
venv\Scripts\activate.bat
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify .env file exists
# (Should already exist at recommender-fastapi/.env)

# Start the recommender service
python main.py
# Should see: "✅ OmniSell Recommender Service Started"
```

Expected output:
```
✅ OmniSell Recommender Service Started
📦 Loaded X products
🧠 Using model: sentence-transformers/all-MiniLM-L6-v2
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Setup Orchestrator (Node.js)

In a new terminal:

```bash
# Navigate to orchestrator directory
cd orchestrator-node

# Install dependencies
npm install

# Verify .env file exists
# (Should already exist at orchestrator-node/.env)

# Start the orchestrator
npm start
# Should see: "Orchestrator live on port 5000"
```

Expected output:
```
Orchestrator live on port 5000
```

### 3. Setup Frontend (React)

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify .env.local file exists
# (Should already exist at frontend/.env.local)

# Start the frontend development server
npm run dev
# Should see: "Local: http://localhost:5173"
```

Expected output:
```
Local:   http://localhost:5173/
Press q + enter to quit
```

## Verification

### Test Recommender API
```bash
# Open PowerShell and test the recommender endpoint
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get

# Expected response should include status: "healthy"
```

### Test Orchestrator API
```bash
# Test orchestrator endpoint
$body = @{
    message = "I'm looking for party wear"
    session_id = $null
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/message" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

# Expected response should include recommendations (cards)
```

### Test Full Integration
1. Open browser: `http://localhost:5173`
2. Login with a test customer
3. Type in chat: "I'm looking for party wear"
4. System should:
   - Send request to orchestrator
   - Orchestrator calls recommender
   - Recommender returns products
   - Frontend displays recommendations

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend (Dev) | 5173 | http://localhost:5173 |
| Orchestrator | 5000 | http://localhost:5000 |
| Recommender | 8000 | http://localhost:8000 |

## Environment Variables

### Frontend (.env.local)
```
VITE_ORCHESTRATOR_URL=http://localhost:5000
VITE_RECOMMENDER_URL=http://localhost:8000
```

### Orchestrator (.env)
```
PORT=5000
RECOMMENDER_URL=http://localhost:8000/recommend
MONGO_URI=
DB_NAME=omnisell
NODE_ENV=development
```

### Recommender (.env)
```
PORT=8000
HOST=0.0.0.0
PRODUCTS_JSON_PATH=products.json
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

## Troubleshooting

### Frontend can't reach Orchestrator
- Check that orchestrator is running on port 5000
- Check VITE_ORCHESTRATOR_URL in .env.local
- Check browser console for CORS errors
- The orchestrator has CORS enabled, so cross-origin requests should work

### Orchestrator can't reach Recommender
- Check that recommender is running on port 8000
- Check RECOMMENDER_URL in orchestrator .env
- Look at orchestrator logs for error messages

### Recommender won't start
- Ensure Python 3.8+ is installed
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`
- Check that products.json exists in recommender-fastapi directory

### Vite dev server not running
- Ensure Node.js v16+ is installed
- Run: `npm install` in frontend directory
- Check that port 5173 is not in use

## Testing Sample Queries

Try these queries in the chatbot:
- "I'm looking for party wear"
- "Show me kurtas"
- "Wedding wear please"
- "Office wear options"
- "Street wear"
- "Casual clothes"
- "I want something under 2000"

## API Endpoints

### Orchestrator
- `POST /message` - Main chat endpoint
  - Request: `{ message: string, session_id?: string }`
  - Response: `{ session_id: string, response: string, cards: [], offers: [] }`

- `GET /` - Health check

### Recommender
- `POST /recommend` - Get recommendations
  - Request: `{ query: string, top_k?: int, min_price?: int, max_price?: int, category?: string }`
  - Response: `{ results: [], query_used: string, count: int }`

- `GET /products` - Get all products
- `GET /products/{id}` - Get specific product
- `GET /` - Health check

## Next Steps

1. Monitor the logs from all three services as you interact with the system
2. Check browser Network tab to see API calls
3. Test different queries to see recommendations
4. Once working, you can:
   - Add database integration (MongoDB via orchestrator)
   - Deploy to production
   - Add authentication
   - Implement payment gateway in checkout
   - Add order management features

## Common Commands

Open 3 terminals for development:

**Terminal 1 (Recommender):**
```bash
cd recommender-fastapi
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 (Orchestrator):**
```bash
cd orchestrator-node
npm start
```

**Terminal 3 (Frontend):**
```bash
cd frontend
npm run dev
```

## Support

For debugging:
- Check logs in each terminal
- Use browser DevTools (F12) to inspect network requests
- Check that all URLs use http:// not https:// for localhost
- Ensure no other services are running on required ports (5000, 5173, 8000)
