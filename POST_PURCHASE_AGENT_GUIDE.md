# 🎁 Retail-Genie Post-Purchase Agent Guide

## Overview

The Post-Purchase Agent is a comprehensive system for managing customer interactions **after purchase**, including:
- ✅ **Order Tracking** - Real-time order status updates
- ✅ **Shipment Tracking** - Location and delivery updates
- ✅ **Returns Management** - Initiate and track returns
- ✅ **Exchanges** - Process product exchanges
- ✅ **Feedback Collection** - Solicit and manage customer reviews
- ✅ **Loyalty Points** - Track and redeem loyalty rewards

---

## 🏗️ System Architecture

### Data Layer

#### 1. **Customer Data** (`customers.json`)
- 10 synthetic customer profiles
- Demographics (age, location, gender)
- Purchase history with order details
- Loyalty tier and points
- Notification preferences
- Device preferences (mobile/web)

**Sample Customer:**
```json
{
  "customer_id": "CUST001",
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@email.com",
  "loyalty_tier": "Silver",
  "loyalty_points": 2597,
  "purchase_history": [
    {
      "order_id": "ORD001",
      "date": "2025-11-15",
      "items": [{"product_id": 1, "name": "Blue Denim Jeans", "price": 1599}],
      "status": "delivered"
    }
  ]
}
```

#### 2. **Inventory Data** (`inventory.json`)
- Store locations (3 major cities: Mumbai, Bangalore, Delhi)
- Real-time stock levels:
  - Online inventory
  - Per-store inventory
  - Warehouse stock
- Reorder levels and status

**Store Locations:**
- STORE001: Mumbai Central
- STORE002: Bangalore Tech Park
- STORE003: Delhi North

**Stock Tracking:**
```json
{
  "product_id": 1,
  "name": "Blue Denim Jeans",
  "online_stock": 45,
  "store_stock": {
    "STORE001": 12,
    "STORE002": 8,
    "STORE003": 15
  },
  "warehouse_stock": 150,
  "status": "in_stock"
}
```

#### 3. **Promotions & Loyalty** (`promotions.json`)
- 3 loyalty tiers:
  - **Silver**: 0-4,999 points (5% discount, free shipping @₹2000)
  - **Gold**: 5,000-14,999 points (10% discount, free shipping @₹1500)
  - **Platinum**: 15,000+ points (15% discount, free shipping all)

- 6 active/scheduled promotions:
  - Diwali Festival Sale (20% off apparel)
  - New Year Electronics Deal (₹1000 off)
  - Grocery Delivery Discount (15% off)
  - Loyalty Boost (2x points)
  - First Purchase Offer (₹200 off)
  - Free Shipping Weekend

#### 4. **Payment Gateway** (`payments.json`)
- Multiple payment methods:
  - Credit/Debit Card
  - UPI
  - Digital Wallet
  - Net Banking
- Mock transaction responses:
  - Approved (95%)
  - Declined (4%)
  - Pending (1%)

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/post-purchase`

### Health Check
```
GET /post-purchase/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Post-Purchase Agent",
  "features": [
    "Order tracking",
    "Shipment tracking",
    "Returns management",
    "Exchanges",
    "Feedback collection",
    "Loyalty points"
  ]
}
```

---

## 🎯 Main Endpoint: POST `/post-purchase`

### 1. Check Order Status

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "check_order_status",
  "order_id": "ORD001"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "order_id": "ORD001",
    "date": "2025-11-15",
    "items": [{"product_id": 1, "name": "Blue Denim Jeans", "price": 1599}],
    "total": 1599,
    "status": "delivered"
  },
  "shipment": {
    "status": "delivered",
    "current_location": "Delivered"
  },
  "estimated_delivery": "2025-11-18"
}
```

---

### 2. Track Shipment

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "track_shipment",
  "order_id": "ORD001"
}
```

**Response:**
```json
{
  "success": true,
  "shipment": {
    "shipment_id": "SHIP001",
    "order_id": "ORD001",
    "tracking_number": "TRK123456789",
    "status": "in_transit",
    "current_location": "Bangalore Distribution Center",
    "estimated_delivery": "2025-11-18"
  },
  "tracking_events": [
    {
      "timestamp": "2025-11-16T08:00:00Z",
      "status": "picked_up",
      "location": "Mumbai Warehouse",
      "message": "Order picked and packed"
    },
    {
      "timestamp": "2025-11-16T14:00:00Z",
      "status": "shipped",
      "location": "Mumbai Hub",
      "message": "Shipment left facility"
    }
  ]
}
```

---

### 3. Initiate Return

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "initiate_return",
  "order_id": "ORD001",
  "params": {
    "reason": "Size doesn't fit"
  }
}
```

**Response:**
```json
{
  "success": true,
  "return_id": "RET1732123456789",
  "message": "Return initiated successfully",
  "next_steps": [
    "Ship the items back to us",
    "Use prepaid return label",
    "Track return status"
  ]
}
```

**Return Reasons Accepted:**
- Size doesn't fit
- Wrong item received
- Product damaged
- Not as described
- Changed mind
- Quality issue

---

### 4. Initiate Exchange

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "initiate_exchange",
  "order_id": "ORD001",
  "params": {
    "new_product_id": 2,
    "reason": "Want different color"
  }
}
```

**Response:**
```json
{
  "success": true,
  "exchange_id": "EXC1732123456789",
  "message": "Exchange initiated successfully",
  "refund_difference": 0,
  "additional_charge": 0,
  "next_steps": [
    "Return old item",
    "New item ships on confirmation"
  ]
}
```

---

### 5. Get Available Returns

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "get_available_returns"
}
```

**Response:**
```json
{
  "success": true,
  "customer_id": "CUST001",
  "returnable_orders_count": 2,
  "return_window_days": 30,
  "orders": [
    {
      "order_id": "ORD001",
      "date": "2025-11-15",
      "items": [{"product_id": 1, "name": "Blue Denim Jeans", "price": 1599}],
      "total": 1599,
      "status": "delivered",
      "days_since_delivery": 3
    }
  ]
}
```

**Rules:**
- Only delivered orders can be returned
- 30-day return window from delivery
- Full refund for unused items
- Partial refund for used items (minus wear/tear)

---

### 6. Submit Feedback

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "submit_feedback",
  "order_id": "ORD001",
  "params": {
    "rating": 5,
    "comment": "Excellent quality, fast delivery!",
    "recommend": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "feedback_id": "FBK1732123456789",
  "message": "Thank you for your feedback!",
  "bonus_points": 50
}
```

**Rating Scale:**
- 1: Poor
- 2: Fair
- 3: Good
- 4: Very Good
- 5: Excellent

**Bonus Points:**
- Feedback submission: +50 points
- Rating 5 stars: +25 points
- Recommending: +25 points

---

### 7. Get Return History

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "get_return_history"
}
```

**Response:**
```json
{
  "success": true,
  "customer_id": "CUST001",
  "returns_count": 1,
  "returns": [
    {
      "order_id": "ORD001",
      "return_id": "RET1732123456789",
      "reason": "Size doesn't fit",
      "status": "return_initiated",
      "initiated_at": "2025-11-18T10:00:00Z"
    }
  ]
}
```

---

### 8. Get Loyalty Points

**Request:**
```json
{
  "customer_id": "CUST001",
  "action": "get_loyalty_points"
}
```

**Response:**
```json
{
  "success": true,
  "customer_id": "CUST001",
  "loyalty_points": 2597,
  "loyalty_tier": "Silver",
  "next_tier_points": 2403,
  "tier_benefits": {
    "discount_percent": 5,
    "free_shipping_threshold": 2000,
    "point_multiplier": 1.0
  }
}
```

**Tier Benefits:**
| Tier | Points Range | Discount | Free Shipping | Multiplier |
|------|-------------|----------|---------------|-----------|
| Silver | 0-4,999 | 5% | ₹2000+ | 1.0x |
| Gold | 5,000-14,999 | 10% | ₹1500+ | 1.5x |
| Platinum | 15,000+ | 15% | All orders | 2.0x |

---

## 🧑 Synthetic Customer Profiles

### 10 Test Customers

| ID | Name | Tier | Points | City | Device |
|----|------|------|--------|------|--------|
| CUST001 | Rajesh Kumar | Silver | 2,597 | Mumbai | Mobile/Web |
| CUST002 | Priya Sharma | Gold | 3,298 | Bangalore | Mobile |
| CUST003 | Amit Patel | Platinum | 7,998 | Delhi | Web |
| CUST004 | Neha Singh | Silver | 610 | Hyderabad | Mobile/Web |
| CUST005 | Vikram Gupta | Gold | 4,398 | Pune | Mobile |
| CUST006 | Anjali Reddy | Silver | 1,999 | Chennai | Mobile |
| CUST007 | Rohan Desai | Gold | 3,998 | Ahmedabad | Web |
| CUST008 | Sanjana Mehta | Silver | 240 | Kolkata | Mobile |
| CUST009 | Deepak Nair | Gold | 998 | Kochi | Mobile/Web |
| CUST010 | Meera Kapoor | Silver | 599 | Jaipur | Mobile |

---

## 📊 Test Scenarios

### Scenario 1: Happy Path - Satisfied Customer
```bash
1. Check order status: "check_order_status" for ORD001
2. Get shipment tracking: "track_shipment" for ORD001
3. Submit positive feedback: Rating 5, recommend true
4. Check loyalty points: Verify +50 bonus points
```

### Scenario 2: Return Flow - Defective Item
```bash
1. Get available returns: "get_available_returns" for CUST001
2. Initiate return: Reason "Product damaged"
3. Get return history: Verify return initiated
4. Check order status: Verify status changed to "return_initiated"
```

### Scenario 3: Exchange Flow - Size Issue
```bash
1. Get available returns: Find returnable order
2. Initiate exchange: Select different size/product
3. Verify no charge difference (same price)
4. Track new shipment after confirmation
```

### Scenario 4: Loyalty Progression
```bash
1. Get loyalty points for Gold tier customer (CUST002)
2. Verify tier benefits
3. Check if next purchase will upgrade to Platinum
4. Simulate purchase and verify points update
```

---

## 🎬 Demo Requests

### Test with cURL

```bash
# Check order status
curl -X POST http://localhost:5000/post-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "action": "check_order_status",
    "order_id": "ORD001"
  }'

# Track shipment
curl -X POST http://localhost:5000/post-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "action": "track_shipment",
    "order_id": "ORD001"
  }'

# Submit feedback
curl -X POST http://localhost:5000/post-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "action": "submit_feedback",
    "order_id": "ORD001",
    "params": {
      "rating": 5,
      "comment": "Great product!",
      "recommend": true
    }
  }'

# Initiate return
curl -X POST http://localhost:5000/post-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "action": "initiate_return",
    "order_id": "ORD001",
    "params": {
      "reason": "Size doesn'\''t fit"
    }
  }'

# Get loyalty points
curl -X POST http://localhost:5000/post-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST001",
    "action": "get_loyalty_points"
  }'
```

---

## 🔌 Integration Points

### Mock Payment Gateway
- Process authorizations
- Capture payments
- Handle declined transactions
- Issue refunds for returns

### Inventory System
- Check product availability
- Reserve items for exchanges
- Update stock levels
- Track warehouse levels

### Shipment Provider
- Generate tracking numbers
- Update delivery status
- Estimate delivery dates
- Handle transit events

### Notification Service
- Email confirmations
- SMS updates
- WhatsApp alerts
- Push notifications

### Analytics
- Customer satisfaction scores
- Return rates by product
- Feedback sentiment analysis
- Loyalty tier progression

---

## 📈 Key Metrics

### Customer Metrics
```
Total Customers: 10
Average Loyalty Points: 2,677
Gold/Platinum Customers: 40%
Silver Customers: 60%
```

### Order Metrics
```
Total Orders: 14
Delivered Orders: 11
In Transit: 2
Processing: 1
Average Order Value: ₹2,086
```

### Inventory Metrics
```
Total Online Stock: 583 units
Average Store Stock: 50 units per store
Warehouse Stock: 1,345 units
Out of Stock: 0 products
```

### Promotion Metrics
```
Active Promotions: 4
Scheduled Promotions: 1
Max Discount: 20%
Total Promo Value: ₹50,000+
```

---

## ✅ Implementation Checklist

- [x] 10 synthetic customer profiles
- [x] Multi-store inventory system
- [x] 3-tier loyalty program
- [x] 6 active/scheduled promotions
- [x] Mock payment gateway
- [x] Order tracking
- [x] Shipment tracking
- [x] Return management
- [x] Exchange processing
- [x] Feedback collection
- [x] Loyalty points system
- [x] Comprehensive API

---

## 🚀 Next Steps

### For Submission
1. Test all 8 API endpoints
2. Verify all customer scenarios
3. Check error handling
4. Document API usage examples
5. Create demo flow video

### For Production
1. Connect to real payment gateway
2. Integrate with actual shipping provider
3. Add database persistence
4. Implement notification service
5. Add analytics dashboard

---

**Status**: ✅ **Complete & Ready for Testing**

All components implemented, mock data loaded, APIs ready for integration.
