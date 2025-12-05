# 🎬 How to Access & Use Retail-Genie

**Last Updated**: December 5, 2025  
**Status**: ✅ System Running & Verified

---

## 🚀 Right Now - Access the System

### Option 1: System Already Running
If you followed setup in another terminal:

**Browser**: http://localhost:5173  
**Status**: ✅ Frontend running  

**API Health Check**:
```bash
Invoke-WebRequest -Uri "http://localhost:5000/post-purchase/health" -Method GET
```
**Expected**: 200 OK with features list

---

## 📚 Documentation - Where to Start

### Absolute First Steps
1. **[README.md](./README.md)** - Read this FIRST (5 min)
2. **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - One-page overview (1 min)
3. **[QUICK_START.md](./QUICK_START.md)** - Get it running (5 min)

### Then Explore
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Find any topic
- **[README_COMPLETE_SYSTEM.md](./README_COMPLETE_SYSTEM.md)** - Full overview
- **[POST_PURCHASE_AGENT_GUIDE.md](./POST_PURCHASE_AGENT_GUIDE.md)** - API details

### For Verification
- **[SYSTEM_VERIFICATION_REPORT.md](./SYSTEM_VERIFICATION_REPORT.md)** - Test results
- **[SESSION_COMPLETION_REPORT.md](./SESSION_COMPLETION_REPORT.md)** - What was completed

---

## 💻 Access Points

### User Interface (Frontend)
```
URL: http://localhost:5173
Port: 5173
Status: React Vite dev server
Components: Products, Chat, Checkout, Post-Purchase
```

### Shopping Agent API
```
URL: http://localhost:5000/message
Port: 5000
Method: POST
Purpose: Natural language shopping assistant
```

### Post-Purchase API
```
URL: http://localhost:5000/post-purchase
Port: 5000
Method: POST
Purpose: Order tracking, returns, loyalty, feedback
```

### Health Check
```
URL: http://localhost:5000/post-purchase/health
Port: 5000
Method: GET
Purpose: Verify service is running
```

### AI Recommender
```
URL: http://localhost:8000
Port: 8000
Purpose: Semantic search and recommendations
```

---

## 🧪 Testing Access

### Run Complete Test Suite
```bash
cd orchestrator-node
node test-comprehensive.js
```

**Expected Output**:
```
✅ Health Check                                 PASS
✅ Check Order Status                           PASS
✅ Track Shipment                               PASS
✅ Get Available Returns                        PASS
✅ Get Loyalty Points                           PASS
✅ Get Return History                           PASS
✅ Initiate Return                              PASS
✅ Submit Feedback                              PASS

Success Rate: 100%
```

### Manual API Tests
```bash
# Test health
Invoke-WebRequest -Uri "http://localhost:5000/post-purchase/health" -Method GET

# Test post-purchase (check loyalty points)
$body = @{
  customer_id='CUST001'
  action='get_loyalty_points'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/post-purchase" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 📂 File Access

### Documentation Files
```
Location: c:\Users\ADMIN\OneDrive\Documents\GitHub\Retail-Genie-0.1\

Key Files:
├── README.md                              (Master guide - START HERE)
├── QUICK_START.md                         (5-min setup)
├── EXECUTIVE_SUMMARY.md                   (One-page overview)
├── DOCUMENTATION_INDEX.md                 (Navigation guide)
├── POST_PURCHASE_AGENT_GUIDE.md           (API reference)
├── SYSTEM_VERIFICATION_REPORT.md          (Test results)
├── README_COMPLETE_SYSTEM.md              (Full system)
├── DEMO_SCRIPT.md                         (Demo scenarios)
├── PROJECT_COMPLETION_SUMMARY.md          (Deliverables)
├── SESSION_COMPLETION_REPORT.md           (Session summary)
├── FILE_MANIFEST.md                       (File listing)
└── HOW_TO_ACCESS.md                       (This file)
```

### Source Code
```
Location: c:\Users\ADMIN\OneDrive\Documents\GitHub\Retail-Genie-0.1\

Services:
├── frontend/                              (React UI)
├── orchestrator-node/                     (Node.js backend)
│   ├── src/
│   │   ├── controllers/                   (API handlers)
│   │   ├── services/                      (Business logic)
│   │   ├── config/                        (Configuration)
│   │   └── data/                          (Mock database)
│   └── test-comprehensive.js              (Tests)
└── recommender-fastapi/                   (Python ML)
```

---

## 🔍 Data Access

### Customer Data
```
File: orchestrator-node/src/data/customers.json
Contains: 10 customer profiles
Access via: API with customer_id (CUST001-CUST010)
Use in: Post-purchase endpoints
```

### Product Data
```
File: orchestrator-node/src/data/products.json
Also: frontend/src/data/products.json
Also: recommender-fastapi/products.json
Contains: 30 products across 10 categories
```

### Inventory Data
```
File: orchestrator-node/src/data/inventory.json
Contains: 3 store locations with stock levels
Stores: Mumbai, Bangalore, Delhi
```

### Promotions Data
```
File: orchestrator-node/src/data/promotions.json
Contains: 6 promotions + 3 loyalty tiers
Includes: Discount rules, coupon codes
```

---

## 🎯 What You Can Do Right Now

### 1. Access the UI (Immediate)
```
Browser: http://localhost:5173
Features:
├─ View 30 products
├─ Search by category
├─ Chat with shopping agent
├─ See order tracking
└─ View loyalty points
```

### 2. Test the APIs (5 minutes)
```bash
cd orchestrator-node
node test-comprehensive.js
# All 8 tests should pass ✅
```

### 3. Review Documentation (10 minutes)
Start with README.md → QUICK_START.md

### 4. Explore Code (30 minutes)
```
orchestrator-node/src/
├── controllers/messageController.js       (900+ lines)
├── controllers/postPurchaseController.js  (150+ lines)
└── services/postPurchaseService.js        (350+ lines)
```

---

## 🔗 API Examples

### Get Loyalty Points
```bash
$body = @{
  customer_id='CUST001'
  action='get_loyalty_points'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/post-purchase" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content
```

**Response**:
```json
{
  "success": true,
  "customer_id": "CUST001",
  "loyalty_points": 2597,
  "loyalty_tier": "Silver",
  "tier_benefits": {...}
}
```

### Get Available Returns
```bash
$body = @{
  customer_id='CUST001'
  action='get_available_returns'
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/post-purchase" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | Select-Object -ExpandProperty Content
```

More examples in [POST_PURCHASE_AGENT_GUIDE.md](./POST_PURCHASE_AGENT_GUIDE.md)

---

## 🎬 Demo Access

### Ready-Made Demo Scenarios
See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for 5 complete scenarios:

1. **New Customer Discovery**
2. **Browse & Filter**
3. **Checkout Process**
4. **Post-Purchase Tracking**
5. **Returns & Loyalty**

### How to Run Demo
1. Open browser to http://localhost:5173
2. Use customer data from [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
3. Follow scenario steps
4. Show API responses in terminal

---

## 🐛 Troubleshooting Access

### "Cannot connect to localhost:5173"
```bash
# Check if frontend is running
# In orchestrator-node directory:
cd ../frontend
npm run dev
# Should see: Ready in X ms
```

### "Cannot connect to localhost:5000"
```bash
# Check if orchestrator is running
# In root directory:
cd orchestrator-node
node src/index.js
# Should see: Orchestrator live on port 5000
```

### "Port already in use"
```bash
# Kill processes on ports
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
```

See [QUICK_START.md - Troubleshooting](./QUICK_START.md#-troubleshooting) for more

---

## 📊 Access by Role

### For End Users
1. Open: http://localhost:5173
2. Browse products
3. Chat with shopping agent
4. Track orders
5. Submit feedback

### For Developers
1. Read: [README_COMPLETE_SYSTEM.md](./README_COMPLETE_SYSTEM.md)
2. Review: orchestrator-node/src code
3. Run: tests in test-comprehensive.js
4. Reference: [POST_PURCHASE_AGENT_GUIDE.md](./POST_PURCHASE_AGENT_GUIDE.md)

### For DevOps/Deployment
1. Review: Package.json, requirements.txt
2. Check: Configuration in env.js
3. Understand: 3-service architecture
4. Deploy: Using Docker/Cloud instructions

### For Product Managers
1. Read: [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)
2. Review: [PRODUCT_EXPANSION_GUIDE.md](./PRODUCT_EXPANSION_GUIDE.md)
3. See: 30 products, 10 categories
4. Check: Loyalty tiers, promotions

---

## 🗺️ Quick Navigation

### "I want to..."

**...get the system running**
→ [QUICK_START.md](./QUICK_START.md)

**...understand what this is**
→ [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) or [README.md](./README.md)

**...see the API documentation**
→ [POST_PURCHASE_AGENT_GUIDE.md](./POST_PURCHASE_AGENT_GUIDE.md)

**...verify everything works**
→ [SYSTEM_VERIFICATION_REPORT.md](./SYSTEM_VERIFICATION_REPORT.md)

**...find a specific document**
→ [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

**...see what files exist**
→ [FILE_MANIFEST.md](./FILE_MANIFEST.md)

**...understand the complete project**
→ [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md)

**...do a demo presentation**
→ [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

---

## ⏱️ Time Investments

| Activity | Time | Value |
|----------|------|-------|
| Read EXECUTIVE_SUMMARY | 1 min | Understand scope |
| Read QUICK_START | 5 min | Setup system |
| Run tests | 1 min | Verify working |
| Access UI | 2 min | See it in action |
| Read full README | 10 min | Deep understanding |
| Review API docs | 15 min | Integration ready |
| **Total**: | **35 min** | **Production ready** |

---

## ✅ Verification Checklist

Before assuming everything is working:

- [ ] Can access http://localhost:5173
- [ ] Can run `node test-comprehensive.js` with 8/8 passing
- [ ] Can call http://localhost:5000/post-purchase/health
- [ ] Have read [README.md](./README.md)
- [ ] Understand 3-service architecture
- [ ] Know location of main documentation

If all checked ✅, system is ready for use!

---

## 🎉 You're Ready!

You now know:
✅ Where everything is located  
✅ How to access each component  
✅ Which documents to read  
✅ How to test the system  
✅ What you can do immediately  

---

## 📞 Still Need Help?

1. **Can't find something?** → Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
2. **Doesn't work?** → Follow [QUICK_START.md - Troubleshooting](./QUICK_START.md#-troubleshooting)
3. **Want API examples?** → See [POST_PURCHASE_AGENT_GUIDE.md](./POST_PURCHASE_AGENT_GUIDE.md)
4. **Need to integrate?** → Read [API_INTEGRATION.md](./API_INTEGRATION.md)
5. **Want to present?** → Use [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

---

**Next Step**: Read [README.md](./README.md) → Follow [QUICK_START.md](./QUICK_START.md)

**Status**: ✅ System Ready  
**Time to Use**: < 5 minutes  
**Everything Working**: ✅ YES
