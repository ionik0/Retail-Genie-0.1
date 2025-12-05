# AI Retail Sales Agent - ABFRL Hackathon Project

A comprehensive AI-driven conversational sales agent web application that simulates an omnichannel retail experience with multiple specialized agents.

## Features

### 🎯 Core Functionality

1. **Customer Login/Start Chat** - Simple login interface with customer profile management
2. **AI Chat Interface** - Conversational sales agent that:
   - Asks about shopping preferences
   - Provides personalized product recommendations
   - Checks inventory across warehouses and stores
   - Offers fulfillment options (Ship to Home, Click & Collect, Try in Store)
   - Guides customers through the purchase journey

3. **Product Display** - Beautiful product cards with:
   - Product images, prices, and details
   - Inventory check functionality
   - Add to cart feature

4. **Inventory Management** - Real-time inventory checking:
   - Warehouse stock availability
   - Store-level inventory across multiple locations
   - Fulfillment options based on availability

5. **Checkout System** - Complete payment flow:
   - Multiple payment methods (UPI, Card, COD)
   - Promo code application
   - Loyalty points redemption
   - Payment failure simulation with retry

6. **Order Confirmation** - Order summary with:
   - Order details and tracking
   - Loyalty points earned
   - Savings breakdown
   - Estimated delivery information

7. **Post-Purchase Support** - Customer service features:
   - Order tracking with status updates
   - Return/Exchange requests
   - Feedback submission

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation (ready for use)

## Project Structure

```
/frontend
  /src
    /components
      CustomerLogin.jsx      # Page 1: Login/Start Chat
      Chatbot.jsx            # Page 2: AI Chat Interface
      ProductsPage.jsx       # Page 3: Product Display
      ProductCard.jsx        # Product card component
      InventoryModal.jsx     # Page 4: Inventory Popup
      Checkout.jsx           # Page 5: Checkout Screen
      OrderSummary.jsx       # Page 6: Order Confirmation
      PostPurchaseSupport.jsx # Page 7: Post-Purchase Support
    /data
      products.json          # Product catalog
      customers.json         # Customer profiles
      inventory.json         # Inventory data
      promotions.json        # Promotions and loyalty rules
    App.jsx                  # Main app with routing
    main.jsx                 # Entry point
    index.css                # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Mock Data

The application uses mock JSON data files to simulate:
- **10+ customer profiles** with demographics, purchase history, and preferences
- **Product catalog** with SKUs, categories, attributes, and pricing
- **Inventory system** with warehouse and multi-store stock levels
- **Promotions** with discount codes and loyalty point rules

## Key Features Demonstrated

✅ **Omnichannel Consistency** - Session continuity across different views
✅ **Sales Psychology** - Consultative language, open questions, upselling
✅ **Edge Cases** - Payment failures, out-of-stock scenarios, order modifications
✅ **Modular Orchestration** - Loosely coupled components for easy extension

## Agent Simulation

The application simulates multiple specialized agents:
- **Sales Agent** - Manages conversation flow and routing
- **Recommendation Agent** - Analyzes preferences and suggests products
- **Inventory Agent** - Checks real-time stock across locations
- **Payment Agent** - Processes payments with failure handling
- **Fulfillment Agent** - Manages delivery and pickup options
- **Loyalty Agent** - Applies points and promotions
- **Post-Purchase Support Agent** - Handles returns and feedback

## Usage Flow

1. **Login** - Enter customer name or select from demo customers
2. **Chat** - Interact with AI assistant about shopping needs
3. **Browse** - View products and check inventory
4. **Checkout** - Select payment method and apply discounts
5. **Confirm** - Review order and track delivery
6. **Support** - Track orders, request returns, or provide feedback

## Demo Customers

Quick select available for:
- Rajesh Kumar (Gold Member)
- Priya Sharma (Silver Member)
- Amit Patel (Platinum Member)

## Notes

- All data is stored in localStorage for session persistence
- Payment processing is simulated with 30% failure rate for demonstration
- Inventory data is static but structured to simulate real-time checks
- The UI is fully responsive and works on mobile, tablet, and desktop

