# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Testing the Application

### Page 1: Customer Login
- Enter a customer name (e.g., "Rajesh Kumar")
- Or click on one of the quick-select demo customers
- Click "Start Chat"

### Page 2: AI Chat Interface
- The AI will greet you and ask about your shopping occasion
- Try responses like:
  - "Office wear"
  - "Casual"
  - "Formal"
- The AI will show product recommendations
- Use quick actions: "Check Inventory", "View All Products", "Proceed to Checkout"

### Page 3: Product Display
- Browse all available products
- Click "Check Inventory" to see stock availability
- Click "Add to Cart" to add items
- Use "Chat with AI" button to return to chat

### Page 4: Inventory Popup
- Shows warehouse and store-level inventory
- Select fulfillment option:
  - Ship to Home
  - Click & Collect
  - Reserve for Try-On

### Page 5: Checkout
- Select payment method (UPI, Card, COD)
- Apply promo codes (try: WELCOME20, SHIRTS30, FLAT500)
- Toggle loyalty points usage
- Click "Pay" - payment may fail (30% chance) to demonstrate retry

### Page 6: Order Confirmation
- View order details
- See loyalty points earned
- Click "Track Your Order" or "Return/Exchange"

### Page 7: Post-Purchase Support
- Track order status
- Submit return/exchange requests
- Provide feedback with ratings

## Demo Promo Codes
- `WELCOME20` - 20% off first order
- `SHIRTS30` - 30% off shirts
- `FLAT500` - ₹500 off orders above ₹3000
- `FOOTWEAR25` - 25% off footwear

## Demo Customers
- **Rajesh Kumar** - Gold Member (2500 points)
- **Priya Sharma** - Silver Member (1200 points)
- **Amit Patel** - Platinum Member (5000 points)

## Features to Test

✅ **Omnichannel Flow**: Login → Chat → Browse → Checkout → Confirm
✅ **Payment Failure**: Try checkout multiple times to see retry flow
✅ **Inventory Check**: Check products to see different availability scenarios
✅ **Loyalty Points**: Use points during checkout
✅ **Promo Codes**: Apply different discount codes
✅ **Post-Purchase**: Track orders and submit returns

## Troubleshooting

- **Port already in use**: Change port in `vite.config.js` or kill the process using the port
- **Dependencies not installing**: Try `npm install --legacy-peer-deps`
- **Styles not loading**: Ensure TailwindCSS is properly configured

