# 📚 Integration Resources - Complete Reference

## 📖 Documentation Files (Read in This Order)

### 1. **README_INTEGRATION.md** ⭐ START HERE
   - Overview of what was done
   - Quick system diagram
   - Success checklist
   - Troubleshooting quick reference

### 2. **QUICK_START.txt** 
   - 60-second quick reference
   - Commands to start all services
   - Basic testing commands
   - Ports and URLs table

### 3. **INTEGRATION_GUIDE.md** 
   - Detailed setup instructions
   - Prerequisites
   - Step-by-step installation
   - Environment variable reference
   - Port configuration
   - Verification steps
   - Comprehensive troubleshooting

### 4. **API_INTEGRATION.md** 
   - System architecture
   - Endpoint documentation
   - Request/response examples
   - Frontend API usage
   - Debug utilities
   - Manual testing examples

### 5. **CODE_CHANGES.md** 
   - Detailed code change reference
   - Before/after code comparisons
   - Architecture changes
   - Data flow diagrams
   - Performance impact
   - Future enhancements

### 6. **CHANGES_SUMMARY.md** 
   - Summary of all modifications
   - Files created/modified
   - New features implemented
   - What works now
   - Next steps

### 7. **VERIFICATION.md** 
   - Verification checklist
   - Installation commands
   - Testing procedures
   - Success indicators

---

## 🔧 Utility Scripts

### **start-all.ps1**
Starts all three services in separate terminals
```bash
.\start-all.ps1
```

### **test-integration.ps1**
Tests all services and integration
```bash
.\test-integration.ps1
```

---

## 💻 Source Code Files

### Frontend
- `frontend/src/services/api.js` - API client
- `frontend/src/services/debug.js` - Debug utilities
- `frontend/src/components/Chatbot.jsx` - Chat component (UPDATED)
- `frontend/src/App.jsx` - Main app (UPDATED)
- `frontend/package.json` - Dependencies (UPDATED)
- `frontend/.env.local` - Configuration (NEW)

### Orchestrator
- `orchestrator-node/src/controllers/messageController.js` - Message handling (UPDATED)
- `orchestrator-node/src/services/recommenderService.js` - Recommender calls (UPDATED)
- `orchestrator-node/.env` - Configuration (UPDATED)

### Recommender
- `recommender-fastapi/.env` - Configuration (NEW)

---

## 🚀 Quick Start Commands

```bash
# Terminal 1: Recommender
cd recommender-fastapi
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2: Orchestrator
cd orchestrator-node
npm start

# Terminal 3: Frontend
cd frontend
npm run dev

# Browser
open http://localhost:5173
```

---

## 🧪 Testing Commands

### Browser Console
```javascript
// Check services
await debugAPI.checkAllServices()

// Test flow
await debugAPI.testRecommendationFlow('party wear')

// Full report
await debugAPI.generateReport()

// View config
debugAPI.logEnvironment()
```

### PowerShell
```bash
# Test all services
.\test-integration.ps1

# Test specific endpoint
$body = @{message = "party wear"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/message" `
    -Method Post -Headers @{"Content-Type"="application/json"} -Body $body
```

---

## 📊 System Ports & URLs

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Orchestrator | 5000 | http://localhost:5000 |
| Recommender | 8000 | http://localhost:8000 |
| Recommender Docs | 8000 | http://localhost:8000/docs |

---

## ⚙️ Configuration Files

### `frontend/.env.local`
```
VITE_ORCHESTRATOR_URL=http://localhost:5000
VITE_RECOMMENDER_URL=http://localhost:8000
```

### `orchestrator-node/.env`
```
PORT=5000
RECOMMENDER_URL=http://localhost:8000/recommend
MONGO_URI=
DB_NAME=omnisell
NODE_ENV=development
```

### `recommender-fastapi/.env`
```
PORT=8000
HOST=0.0.0.0
PRODUCTS_JSON_PATH=products.json
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

---

## 🔌 API Endpoints

### Orchestrator
```
POST /message
  Input: { message: string, session_id?: string }
  Output: { session_id, response, cards, offers }

GET /
  Output: "Orchestrator Running"
```

### Recommender
```
POST /recommend
  Input: { query, top_k, min_price?, max_price?, category? }
  Output: { results, query_used, count }

GET /products
  Output: { products, total }

GET /products/{id}
  Output: { product }

GET /
  Output: { status, service, version }
```

---

## 🎯 Test Queries

Try these in the chatbot:
- "party wear"
- "kurtas"
- "wedding wear"
- "office wear"
- "street wear"
- "casual"
- "shoes"
- "I want something under 2000"
- "show me blazers"

---

## ✅ Verification Steps

1. [ ] Install dependencies
   ```bash
   npm install  # in frontend and orchestrator-node
   pip install -r requirements.txt  # in recommender-fastapi
   ```

2. [ ] Start all services
   - Terminal 1: Recommender
   - Terminal 2: Orchestrator
   - Terminal 3: Frontend

3. [ ] Verify services
   ```bash
   .\test-integration.ps1
   ```

4. [ ] Browser test
   - Open http://localhost:5173
   - Login
   - Type "party wear"
   - See recommendations

5. [ ] Console test
   ```javascript
   await debugAPI.checkAllServices()
   ```

---

## 📋 File Structure

```
Retail-Genie-0.1/
├── 📄 README_INTEGRATION.md          ⭐ START HERE
├── 📄 QUICK_START.txt                ← 60-second overview
├── 📄 INTEGRATION_GUIDE.md           ← Detailed setup
├── 📄 API_INTEGRATION.md             ← API reference
├── 📄 CODE_CHANGES.md                ← Code details
├── 📄 CHANGES_SUMMARY.md             ← What changed
├── 📄 VERIFICATION.md                ← Checklist
│
├── 🚀 start-all.ps1                  ← Start all services
├── 🧪 test-integration.ps1           ← Test all services
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chatbot.jsx           ✏️ MODIFIED
│   │   ├── services/
│   │   │   ├── api.js                ✨ NEW
│   │   │   └── debug.js              ✨ NEW
│   │   └── App.jsx                   ✏️ MODIFIED
│   ├── package.json                  ✏️ MODIFIED
│   └── .env.local                    ✨ NEW
│
├── orchestrator-node/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── messageController.js  ✏️ MODIFIED
│   │   └── services/
│   │       └── recommenderService.js ✏️ MODIFIED
│   ├── package.json
│   └── .env                          ✏️ MODIFIED
│
└── recommender-fastapi/
    ├── main.py
    └── .env                          ✨ NEW
```

Legend: ⭐ = Start here, ✨ = New, ✏️ = Modified

---

## 🔍 Troubleshooting by Error

### "Cannot GET http://localhost:5000"
- Orchestrator not running
- Solution: Run `npm start` in orchestrator-node

### "Cannot GET http://localhost:8000"
- Recommender not running
- Solution: Run `python main.py` in recommender-fastapi

### "ModuleNotFoundError: No module named 'fastapi'"
- Python dependencies not installed
- Solution: `pip install -r requirements.txt`

### "Cannot find module 'axios'"
- Frontend dependencies not installed
- Solution: `npm install` in frontend

### "CORS error in browser"
- Check VITE_ORCHESTRATOR_URL in .env.local
- Should be `http://localhost:5000` (with http://)

### "No recommendations showing"
- Recommender not loaded products
- Check logs for "Loaded X products" message
- Verify products.json exists

---

## 🎓 Learning Resources

### Understanding the Architecture
1. Read: README_INTEGRATION.md (system diagram)
2. Read: API_INTEGRATION.md (endpoint docs)
3. Read: CODE_CHANGES.md (code details)

### Setting Up
1. Follow: INTEGRATION_GUIDE.md (step-by-step)
2. Use: start-all.ps1 (to start services)
3. Run: test-integration.ps1 (to verify)

### Debugging
1. Use: Browser console debug tools
2. Check: Terminal logs
3. Read: INTEGRATION_GUIDE.md (troubleshooting)

### Understanding Code
1. Look at: frontend/src/services/api.js (API client)
2. Look at: frontend/src/components/Chatbot.jsx (chat interface)
3. Read: CODE_CHANGES.md (detailed changes)

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ All 3 services start without errors
- ✅ Browser loads http://localhost:5173
- ✅ Chat shows greeting message
- ✅ Typing "party wear" shows 5 products
- ✅ No errors in browser console
- ✅ `debugAPI.checkAllServices()` returns all "ok"

---

## 📞 Getting Help

1. **Setup Issues?** → Read INTEGRATION_GUIDE.md
2. **API Questions?** → Read API_INTEGRATION.md
3. **Code Details?** → Read CODE_CHANGES.md
4. **Quick Reference?** → Read QUICK_START.txt
5. **Still Stuck?** → Run test-integration.ps1 and check logs

---

## 🎉 Next Steps

Now that integration is complete:

1. ✅ Run all services
2. ✅ Test in browser
3. ✅ Verify all working
4. ✅ Explore the features
5. Consider adding:
   - Database persistence
   - User authentication
   - Payment processing
   - Analytics
   - Production deployment

---

**Version:** Integration Complete v1.0
**Status:** Ready for Development/Testing ✅
**Date:** December 2025

📚 **All documentation is in the same directory as this file!**
