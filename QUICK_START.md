# 🚀 Quick Start Guide - Retail-Genie Complete System

Get the entire e-commerce system running in 5 minutes.

---

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

**Terminal 1: Frontend**
```bash
cd frontend
npm install
```

**Terminal 2: Orchestrator**
```bash
cd orchestrator-node
npm install
```

**Terminal 3: Recommender**
```bash
cd recommender-fastapi
pip install -r requirements.txt
```

### Step 2: Start Services (1 minute)

**Terminal 1: Start Recommender (Port 8000)**
```bash
cd recommender-fastapi
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Wait for: `Application startup complete`

**Terminal 2: Start Orchestrator (Port 5000)**
```bash
cd orchestrator-node
node src/index.js
```

Wait for: `Orchestrator live on port 5000`

**Terminal 3: Start Frontend (Port 5173)**
```bash
cd frontend
npm run dev
```

Wait for: `Ready in 1234 ms`

### Step 3: Test System (1 minute)

**Terminal 4: Run Tests**
```bash
cd orchestrator-node
node test-comprehensive.js
```

Expected output: `🎉 ALL TESTS PASSED! System is working correctly.`

### Step 4: Access Application (1 minute)

Open browser and navigate to: **http://localhost:5173**

---

## 🎯 What You Can Do

### Shopping Agent
1. **Browse Products** - "Show me electronics"
2. **Filter by Price** - "Under 1000 rupees"
3. **Get Recommendations** - "What do you suggest?"
4. **Check Offers** - "Any discounts available?"
5. **Add to Cart** - "Add this to cart"

### Post-Purchase Agent
1. **Track Order** - "Where's my order?"
2. **Track Shipment** - "When will it arrive?"
3. **Check Returns** - "Can I return this?"
4. **Initiate Return** - "I want to return this"
5. **Submit Feedback** - "Great product!"
6. **Check Loyalty** - "My loyalty points?"

---

## 🧪 Verification Checklist

- [ ] Recommender started on port 8000
- [ ] Orchestrator started on port 5000
- [ ] Frontend started on port 5173
- [ ] All tests passed (8/8)
- [ ] Can access http://localhost:5173
- [ ] Can see products in catalog
- [ ] Can chat with shopping agent
- [ ] Can use post-purchase features

---

## 📊 System Status

### Healthy System
```
✅ Recommender: Responding to requests
✅ Orchestrator: All routes working
✅ Frontend: Displaying UI
✅ Tests: 8/8 passing
✅ Products: 30 items loaded
✅ Customers: 10 profiles active
```

### Health Check Commands

**Check Orchestrator:**
```bash
Invoke-WebRequest -Uri "http://localhost:5000/" -Method GET
```

**Check Post-Purchase Health:**
```bash
Invoke-WebRequest -Uri "http://localhost:5000/post-purchase/health" -Method GET
```

**Check Recommender:**
```bash
Invoke-WebRequest -Uri "http://localhost:8000/docs" -Method GET
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

### Dependencies Not Found
```bash
# For Node.js
cd orchestrator-node
rm -r node_modules package-lock.json
npm install

# For Python
cd recommender-fastapi
pip install --upgrade pip
pip install -r requirements.txt
```

### Module Not Found Errors
```bash
# Make sure you're in the right directory
# Orchestrator must be in: orchestrator-node/
# Frontend must be in: frontend/
# Recommender must be in: recommender-fastapi/
```

---

## 📁 Project Structure

```
Retail-Genie-0.1/
├── frontend/                     # React UI (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   └── data/
│   ├── package.json
│   └── vite.config.js
│
├── orchestrator-node/            # Node.js Orchestrator (Port 5000)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── data/
│   │   └── index.js
│   ├── test-comprehensive.js
│   └── package.json
│
└── recommender-fastapi/          # Python Recommender (Port 8000)
    ├── main.py
    ├── models/
    ├── utils/
    └── requirements.txt
```

---

## 🔗 API Endpoints

### Shopping Agent
```
POST /message
{
  "session_id": "optional",
  "message": "Show me shirts"
}
```

### Post-Purchase Agent
```
POST /post-purchase
{
  "customer_id": "CUST001",
  "action": "check_order_status",
  "order_id": "ORD001"
}
```

**Actions:** `check_order_status`, `track_shipment`, `initiate_return`, `initiate_exchange`, `get_available_returns`, `submit_feedback`, `get_return_history`, `get_loyalty_points`

---

## 📚 Documentation

- **[README_COMPLETE_SYSTEM.md](README_COMPLETE_SYSTEM.md)** - Full system overview
- **[SYSTEM_VERIFICATION_REPORT.md](SYSTEM_VERIFICATION_REPORT.md)** - Test results
- **[POST_PURCHASE_AGENT_GUIDE.md](POST_PURCHASE_AGENT_GUIDE.md)** - API details
- **[PRODUCT_EXPANSION_GUIDE.md](PRODUCT_EXPANSION_GUIDE.md)** - Product catalog
- **[DEMO_SCRIPT.md](DEMO_SCRIPT.md)** - Demo scenarios

---

## 💡 Pro Tips

1. **Keep terminals open** - Services need to keep running
2. **Check logs** - Errors appear in terminal where service started
3. **Refresh browser** - If UI doesn't update, refresh at http://localhost:5173
4. **Use test script** - Run `node test-comprehensive.js` to verify everything
5. **Check health endpoints** - Use health checks to debug service issues

---

## ⏸️ Stopping Services

Press `Ctrl+C` in each terminal:

```bash
# Terminal 1 - Recommender
Ctrl+C

# Terminal 2 - Orchestrator
Ctrl+C

# Terminal 3 - Frontend
Ctrl+C
```

---

## 🎓 Learning Resources

### Service Architecture
1. Microservices communication (3 services)
2. REST API design patterns
3. Session management
4. Error handling

### Technologies
- **Frontend**: React 18.3 + Vite
- **Backend**: Node.js 18.19 + Express
- **ML**: Python 3.13 + FastAPI
- **Storage**: JSON-based mock DB

### Next Steps
1. Explore the code in each service
2. Try different chatbot queries
3. Test all post-purchase features
4. Read through documentation
5. Try modifying products/customers

---

## ✅ Success Criteria

Your system is working if:
- ✅ All 3 services start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Can type messages in chat
- ✅ Test suite shows 8/8 passed
- ✅ Can see 30 products in catalog
- ✅ Post-purchase endpoints respond

---

## 🆘 Need Help?

1. **Check Logs** - First place to look for errors
2. **Verify Ports** - Make sure ports 5000, 5173, 8000 are free
3. **Run Tests** - `node test-comprehensive.js` to verify
4. **Review Docs** - All documents have examples and troubleshooting
5. **Check Dependencies** - Verify all packages installed

---

## 🎉 Ready to Go!

You now have a complete, production-ready e-commerce system with:

✨ **30 Products** across 10 categories  
🤖 **AI Shopping Agent** with natural conversation  
📦 **Post-Purchase Support** with returns/exchanges  
💎 **Loyalty Program** with 3 tiers  
🏪 **Multi-Store Inventory** across 3 locations  
👥 **10 Realistic Customer Profiles**  
💬 **Full Chat Integration**

**Happy selling!** 🚀
