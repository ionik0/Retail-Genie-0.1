
# Retail Genie - API Integration Guide

## Quick Start

### What's New ✨

The frontend is now fully connected to the backend services:
- ✅ **Frontend** sends chat messages to **Orchestrator**
- ✅ **Orchestrator** routes to **Recommender** for product recommendations
- ✅ **Recommender** returns AI-powered recommendations using embeddings
- ✅ **Session management** tracks conversation flow
- ✅ **Error handling** with automatic fallback to local data

### System Components

```
Frontend (React)
    ↓ [HTTP POST] /message
Orchestrator (Node.js/Express)
    ├─ Intent Detection
    ├─ Session Management
    └─ API Router
         ↓ [HTTP POST] /recommend
    Recommender (Python/FastAPI)
         ├─ Embedding Engine
         ├─ Product Database
         └─ Similarity Search
```

## Installation

### Prerequisites
- Node.js v16+
- Python 3.8+
- npm / pip

### Step 1: Install Recommender Dependencies

```bash
cd recommender-fastapi
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

### Step 2: Install Orchestrator Dependencies

```bash
cd orchestrator-node
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Starting Services

Open **3 separate terminals** and run in order:

### Terminal 1: Start Recommender (Port 8000)
```bash
cd recommender-fastapi
.\venv\Scripts\Activate.ps1
python main.py
```

Expected output:
```
✅ OmniSell Recommender Service Started
📦 Loaded 20+ products
🧠 Using model: sentence-transformers/all-MiniLM-L6-v2
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Orchestrator (Port 5000)
```bash
cd orchestrator-node
npm start
```

Expected output:
```
Orchestrator live on port 5000
```

### Terminal 3: Start Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
Press q + enter to quit
```

## Configuration

### Frontend (.env.local)
Located at: `frontend/.env.local`
```env
VITE_ORCHESTRATOR_URL=http://localhost:5000
VITE_RECOMMENDER_URL=http://localhost:8000
```

### Orchestrator (.env)
Located at: `orchestrator-node/.env`
```env
PORT=5000
RECOMMENDER_URL=http://localhost:8000/recommend
NODE_ENV=development
```

### Recommender (.env)
Located at: `recommender-fastapi/.env`
```env
PORT=8000
HOST=0.0.0.0
PRODUCTS_JSON_PATH=products.json
```

## API Endpoints

### Orchestrator
**Base URL:** `http://localhost:5000`

#### POST /message
Main chat endpoint that orchestrates all interactions.

**Request:**
```json
{
  "message": "I'm looking for party wear",
  "session_id": null
}
```

**Response:**
```json
{
  "session_id": "uuid-session-id",
  "response": "Here are some great options for you!",
  "cards": [
    {
      "id": 1,
      "name": "Elegant Party Saree",
      "price": 2500,
      "category": "Sarees",
      "image": "url-to-image",
      "description": "Beautiful embroidered party saree"
    }
  ],
  "offers": []
}
```

#### GET /
Health check endpoint.

**Response:**
```
Orchestrator Running
```

---

### Recommender
**Base URL:** `http://localhost:8000`

#### POST /recommend
Get AI-powered product recommendations.

**Request:**
```json
{
  "query": "party wear",
  "top_k": 5,
  "min_price": null,
  "max_price": null,
  "category": null
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Elegant Party Saree",
      "price": 2500,
      "category": "Sarees",
      "image": "url-to-image",
      "description": "Description here"
    }
  ],
  "query_used": "party wear",
  "count": 5
}
```

#### GET /products
Get all available products.

**Response:**
```json
{
  "products": [...],
  "total": 25
}
```

#### GET /products/{id}
Get a specific product by ID.

#### GET /
Health check.

---

## Frontend Integration

### Using the API Service

The frontend has a ready-to-use API service at `src/services/api.js`:

```javascript
import { orchestratorAPI, recommenderAPI } from '../services/api';

// Send message to orchestrator
const response = await orchestratorAPI.sendMessage('I want party wear');

// Get recommendations directly from recommender
const recs = await recommenderAPI.getRecommendations('wedding wear', {
  top_k: 5,
  max_price: 5000
});
```

### Chatbot Component

The `Chatbot.jsx` component is updated to use the orchestrator:

1. **User sends message** → `handleSend()` function
2. **Message sent to Orchestrator** → `orchestratorAPI.sendMessage()`
3. **Orchestrator processes** → calls recommender internally
4. **Products returned** → displayed in chat
5. **Session maintained** → subsequent messages use same session_id

## Debugging

### Browser Console Debug Tools

The frontend exposes debug utilities in the browser console. Open DevTools (F12) and use:

```javascript
// Check all services
await debugAPI.checkAllServices()

// Test recommendation flow
await debugAPI.testRecommendationFlow('kurtas')

// Generate debug report
await debugAPI.generateReport()

// View environment config
debugAPI.logEnvironment()
```

### Test Script

Run the PowerShell test script to verify all services:

```bash
.\test-integration.ps1
```

This will check:
- ✓ Recommender health
- ✓ Orchestrator health
- ✓ Message flow
- ✓ Product retrieval

### Common Troubleshooting

#### "Cannot connect to orchestrator"
- Verify orchestrator running on port 5000
- Check `VITE_ORCHESTRATOR_URL` in `frontend/.env.local`
- Check browser console for CORS errors

#### "Recommender returns no results"
- Verify recommender running on port 8000
- Check `RECOMMENDER_URL` in `orchestrator-node/.env`
- Verify `products.json` exists in recommender-fastapi directory
- Check orchestrator logs for errors

#### "Module not found" errors
- Run `npm install` in frontend and orchestrator-node directories
- Run `pip install -r requirements.txt` in recommender-fastapi directory

#### Python venv not activating
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# If you get an error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again:
.\venv\Scripts\Activate.ps1
```

## Testing

### Manual Testing

1. Open `http://localhost:5173`
2. Login with a test customer
3. Try queries in the chatbot:
   - "I'm looking for party wear"
   - "Show me kurtas"
   - "Wedding wear please"
   - "Office wear under 2000"

### API Testing (PowerShell)

Test the message endpoint:
```powershell
$body = @{
    message = "I want party wear"
    session_id = $null
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/message" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

Test recommendations directly:
```powershell
$body = @{
    query = "kurtas"
    top_k = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/recommend" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

## Architecture Details

### Session Management
- Each user conversation gets a unique `session_id`
- Session tracks conversation history
- Same session_id used for subsequent messages

### Intent Detection
The orchestrator detects user intent:
- **"recommend"** - Get product recommendations (default)
- **"offers"** - View available offers
- **"cart"** - Manage shopping cart

### Error Handling
- API calls have 10-second timeout
- Failures fall back to local product data
- Detailed error logging in all services

### CORS Configuration
- Orchestrator has CORS enabled for all origins
- Allows frontend to call orchestrator directly
- Supports development and production environments

## Next Steps

1. ✅ Integration is now complete
2. Monitor logs from all three services
3. Test various product categories
4. Collect user feedback
5. Optimize AI recommendations if needed
6. Deploy to production

## File Structure

```
Retail-Genie-0.1/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.jsx (Updated - now uses API)
│   │   ├── services/
│   │   │   ├── api.js (New - API utilities)
│   │   │   └── debug.js (New - debug tools)
│   │   └── App.jsx (Updated - imports debug)
│   ├── package.json (Updated - added axios)
│   └── .env.local (New - configuration)
│
├── orchestrator-node/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── messageController.js (Updated - better error handling)
│   │   └── services/
│   │       └── recommenderService.js (Updated - improved API calls)
│   ├── package.json
│   └── .env (Updated - added configuration)
│
├── recommender-fastapi/
│   ├── main.py
│   ├── models/
│   ├── utils/
│   ├── requirements.txt
│   └── .env (New - configuration)
│
├── INTEGRATION_GUIDE.md (New - detailed setup guide)
├── start-all.ps1 (New - startup script)
└── test-integration.ps1 (New - test script)
```

## Support

For issues:
1. Check logs in each terminal
2. Use browser DevTools (F12) to inspect network requests
3. Run `test-integration.ps1` to diagnose issues
4. Check API response formats match documentation
5. Verify all environment URLs use `http://` not `https://` for localhost

## Version Info

- Frontend: React 18.2 + Vite 5.0
- Orchestrator: Node.js 16+ with Express 5.2
- Recommender: Python 3.8+ with FastAPI
- Deployment: Development (localhost:5173/5000/8000)
