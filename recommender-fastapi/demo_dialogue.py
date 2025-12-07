"""
Retail Genie Prototype - Demo Dialogue Script
Perfect for video demonstrations
"""

PROTOTYPE_DIALOGUE = [
    {
        "customer": "Hi, I'm looking for something to wear to a wedding party",
        "assistant": "Welcome to Retail Genie! Congratulations on the upcoming wedding! We have an amazing collection of party and wedding wear. Let me help you find the perfect outfit. What's your budget range and do you prefer traditional or contemporary styles?",
        "products_shown": ["Festive Saree", "Party Suit", "Ethnic Kurta"]
    },
    {
        "customer": "I have around 5000 rupees to spend",
        "assistant": "Perfect! With ₹5000, you have great options. We have beautiful designer sarees, stylish suits, and traditional wear in that range. Are you looking for something more traditional like a saree, or modern like a dress or suit?",
        "products_shown": ["Designer Saree ₹4500", "Party Suit ₹4800", "Festive Kurta ₹3999"]
    },
    {
        "customer": "Show me some sarees please",
        "assistant": "Excellent choice! I'm showing you our best wedding sarees in your budget. These are all premium quality with beautiful embroidery and designs. Each saree comes with free styling consultation. Would you like to know more about any specific design?",
        "products_shown": ["Silk Saree ₹4500", "Georgette Saree ₹4200", "Cotton Saree ₹3500"]
    },
    {
        "customer": "What about the gold embroidered one?",
        "assistant": "Great eye! That's our Silk Saree with hand-embroidered golden motifs - it's absolutely stunning! It's ₹4500, made from premium silk, and perfect for weddings. It comes with a matching blouse and free dry cleaning. Shall I add it to your cart or would you like to see more options?",
        "products_shown": ["Gold Embroidered Saree - Featured"]
    },
    {
        "customer": "I also need something casual for daily wear",
        "assistant": "Perfect! Let me show you our casual collection. We have trendy t-shirts, comfortable jeans, and stylish kurtis that are great for everyday wear. They're affordable and very comfortable. What's your style - Western, ethnic, or mixed?",
        "products_shown": ["Casual T-Shirt ₹999", "Blue Jeans ₹1999", "Casual Kurti ₹1299"]
    },
    {
        "customer": "How much do the jeans cost and what sizes do you have?",
        "assistant": "The jeans are only ₹1999 and are available in sizes 26 to 36. They're made from premium denim, comfortable to wear, and perfect for casual days out. We also have the same style in black and blue. Would you like to add a pair to your order?",
        "products_shown": ["Blue Jeans - All Sizes Available"]
    },
    {
        "customer": "Okay, I'll take the saree and the blue jeans",
        "assistant": "Wonderful! You've made excellent choices. Let me summarize: 1 Gold Embroidered Silk Saree (₹4500) and 1 Blue Jeans (₹1999), Total: ₹6499. Would you like to proceed to checkout? We offer free shipping on orders above ₹5000!",
        "products_shown": ["Order Summary", "Checkout Option"]
    },
    {
        "customer": "Yes, let me check out. Do you have any discounts?",
        "assistant": "Great question! Since this is your first purchase, we have a 10% first-time buyer discount! That brings your total down to ₹5,849. Plus, we're offering free express delivery. Your order will arrive in 2-3 business days. Shall I process this?",
        "products_shown": ["10% Discount Applied", "Final Total: ₹5,849"]
    },
    {
        "customer": "Perfect! Please proceed",
        "assistant": "Thank you for shopping with Retail Genie! Your order has been confirmed. You'll receive a confirmation email shortly with tracking details. Is there anything else I can help you with today?",
        "products_shown": ["Order Confirmation", "Thank You Message"]
    }
]

# Demo interaction function
def run_demo_dialogue():
    """Run through demo dialogue"""
    print("\n" + "="*70)
    print("RETAIL GENIE - PROTOTYPE DEMO")
    print("="*70 + "\n")
    
    for i, exchange in enumerate(PROTOTYPE_DIALOGUE, 1):
        print(f"\n--- Exchange {i} ---")
        print(f"👤 Customer: {exchange['customer']}")
        print(f"\n🤖 Assistant: {exchange['assistant']}")
        print(f"\n📦 Products: {', '.join(exchange['products_shown'])}")
        print("-" * 70)
    
    print("\n" + "="*70)
    print("END OF DEMO")
    print("="*70 + "\n")

# Sample test dialogues for video
TEST_QUERIES = [
    "Hi, I'm looking for party wear",
    "Show me something under 3000 rupees",
    "I need a wedding outfit",
    "What do you have in formal wear?",
    "Show me casual clothes",
    "I'm looking for a blue shirt",
    "Do you have ethnic wear?",
    "What's the cheapest item you have?",
    "Show me your best sellers",
    "I need something for the office"
]

EXPECTED_RESPONSES = {
    "party": "We have beautiful party wear collection with elegant sarees, festive dresses, and stylish party suits.",
    "wedding": "Congratulations! We have a stunning wedding collection with bridal wear and guest outfits.",
    "casual": "We have trendy casual wear including t-shirts, jeans, and comfortable kurtis.",
    "formal": "We have professional formal wear with blazers, formal shirts, and dress trousers.",
    "budget": "We have items at all price points. What type of clothing are you looking for?",
    "office": "Perfect! We have professional office wear that's stylish and comfortable.",
    "ethnic": "We have beautiful ethnic wear including sarees, kurtis, and traditional outfits.",
}

if __name__ == "__main__":
    run_demo_dialogue()
