"""
ABFRL Sales Agent - Deepseek AI Powered Retail Assistant
Intelligent responses for retail customer support
"""
import os
import json
from typing import Optional

class DeepseekAgent:
    """ABFRL Sales Agent with intelligent retail responses"""
    
    def __init__(self):
        """Initialize the Deepseek Sales Agent"""
        self.conversation_history = []
        self.customer_profile = {
            "preferences": [],
            "budget": None,
            "occasion": None
        }
        
    def generate_response(self, user_message: str) -> str:
        """Generate intelligent response based on user message"""
        
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Analyze user message and generate response
        response = self._generate_intelligent_response(user_message)
        
        self.conversation_history.append({
            "role": "assistant",
            "content": response
        })
        
        return response
    
    def _generate_intelligent_response(self, user_message: str) -> str:
        """Generate contextual retail responses"""
        msg_lower = user_message.lower()
        
        # Greeting responses
        if any(word in msg_lower for word in ['hello', 'hi', 'hey', 'greetings', 'namaste']):
            return "Namaste! 👋 Welcome to ABFRL! I'm your AI Sales Assistant. How can I help you find the perfect outfit today? You can ask me about party wear, wedding clothes, casual wear, or any specific items!"
        
        # Party wear queries
        if any(word in msg_lower for word in ['party', 'party wear', 'celebration', 'evening']):
            self.customer_profile['occasion'] = 'party'
            return "🎉 Wonderful! We have an amazing party wear collection! Here's what we offer:\n\n✨ Elegant Dresses - Perfect for formal parties\n✨ Stylish Sarees - Traditional yet modern designs\n✨ Chic Jumpsuits - Contemporary party wear\n✨ Festive Suits - For men\n\nWhat's your budget range, and do you prefer traditional or modern styles?"
        
        # Wedding queries
        if any(word in msg_lower for word in ['wedding', 'bride', 'groom', 'marriage', 'shaadi']):
            self.customer_profile['occasion'] = 'wedding'
            return "💒 Congratulations! What an exciting occasion! We have an exquisite wedding collection:\n\n👰 Bridal Wear - Stunning lehengas, sarees, and gowns\n🤵 Groom Outfits - Elegant sherwanis and suits\n👥 Guest Attire - Beautiful options for attendees\n💍 Accessories - Jewelry and complementary pieces\n\nWhat's your budget and preference - traditional or contemporary?"
        
        # Casual wear
        if any(word in msg_lower for word in ['casual', 'comfortable', 'everyday', 'work', 'office']):
            self.customer_profile['occasion'] = 'casual'
            return "😊 Great choice! Casual wear is essential! We have:\n\n👕 T-Shirts - Various styles and colors\n👖 Jeans - Classic to trendy designs\n👗 Casual Dresses - Comfortable and stylish\n👔 Casual Shirts - Perfect for work\n👟 Sneakers - Matching footwear\n\nWhat's your preferred style and color? Any specific budget?"
        
        # Budget inquiries
        if any(word in msg_lower for word in ['budget', 'price', 'cost', 'under', 'affordable', 'cheap', '₹', 'rs', 'rupees']):
            # Extract budget if mentioned
            if 'under' in msg_lower or 'below' in msg_lower:
                return "Excellent! We have options across all price ranges. We have:\n\n💰 Budget-Friendly: ₹500 - ₹2,000\n💰 Mid-Range: ₹2,000 - ₹5,000\n💰 Premium: ₹5,000 - ₹15,000\n💰 Luxury: ₹15,000+\n\nTell me your budget and what occasion or wear type you're looking for!"
            else:
                return "Perfect! We believe in value for money. What's your budget range, and what type of clothing are you interested in?"
        
        # Product-specific queries
        if any(word in msg_lower for word in ['shirt', 'shirts']):
            return "👕 Excellent choice! Our shirt collection includes:\n\n✓ Formal Shirts - Professional look\n✓ Casual Shirts - Comfortable for everyday\n✓ Party Shirts - Stylish designs\n✓ Designer Shirts - Premium collection\n\nPrefer full sleeves, half sleeves, or specific colors?"
        
        if any(word in msg_lower for word in ['jean', 'jeans', 'denim']):
            return "👖 Our denim collection is fantastic! We offer:\n\n✓ Classic Blue Jeans - Timeless style\n✓ Black Denim - Versatile and sleek\n✓ Skinny Fit - Trendy design\n✓ Straight Fit - Comfortable classic\n✓ Ripped Jeans - Contemporary style\n\nWhat fit and style do you prefer?"
        
        if any(word in msg_lower for word in ['kurta', 'kurtas', 'kurti']):
            return "👗 Beautiful! Our kurta collection is stunning:\n\n✓ Traditional Kurtis - Ethnic charm\n✓ Designer Kurtis - Premium styles\n✓ Party Kurtis - Embellished designs\n✓ Casual Kurtis - Comfortable wear\n✓ Festival Kurtis - Special occasion\n\nDo you prefer embroidered, printed, or plain designs?"
        
        if any(word in msg_lower for word in ['saree', 'sarees', 'sari']):
            return "🎀 Our saree collection is exquisite! We have:\n\n✓ Silk Sarees - Elegant and traditional\n✓ Cotton Sarees - Comfortable and daily wear\n✓ Embroidered Sarees - Ornate designs\n✓ Designer Sarees - Contemporary styles\n✓ Party Sarees - Stunning for special events\n\nPrefer South Indian, Bengali, or other regional styles?"
        
        if any(word in msg_lower for word in ['shoe', 'shoes', 'footwear', 'sneaker', 'sandal']):
            return "👟 Our footwear collection is diverse!\n\n✓ Formal Shoes - Professional and elegant\n✓ Casual Sneakers - Comfortable everyday\n✓ Sandals - Perfect for summers\n✓ Heels - For special occasions\n✓ Boots - Stylish and versatile\n\nWhat type of footwear are you looking for?"
        
        if any(word in msg_lower for word in ['blazer', 'jacket']):
            return "🧥 Our blazer and jacket collection:\n\n✓ Formal Blazers - Professional look\n✓ Casual Jackets - Trendy designs\n✓ Party Blazers - Stylish for events\n✓ Bomber Jackets - Contemporary style\n✓ Denim Jackets - Versatile classic\n\nFor what occasion are you looking?"
        
        # Color preferences
        if 'color' in msg_lower or 'colour' in msg_lower:
            colors = ['red', 'blue', 'black', 'white', 'green', 'yellow', 'pink', 'purple', 'gold', 'silver']
            for color in colors:
                if color in msg_lower:
                    return f"Great color choice! {color.capitalize()} is timeless and versatile. We have many styles in {color}. What type of clothing would you like in {color}?"
            return "What's your preferred color? We have a full spectrum including reds, blues, blacks, whites, greens, and more!"
        
        # Size inquiries
        if any(word in msg_lower for word in ['size', 'fit', 'measurement', 'xs', 'small', 'medium', 'large', 'xl', 'xxl']):
            return "Perfect! We offer sizes from XS to XXL. We can also customize for the perfect fit. What's your usual size? And what are you looking for?"
        
        # Checkout/Purchase
        if any(word in msg_lower for word in ['checkout', 'buy', 'purchase', 'order', 'payment', 'cart']):
            return "Wonderful! I'm excited to help you complete your purchase! 🛍️\n\nWould you like to:\n✓ Review your selected items\n✓ Apply any coupon codes\n✓ Proceed to checkout\n✓ Know about delivery options\n\nWhat would you like to do?"
        
        # Default intelligent response
        if len(self.conversation_history) > 2:
            return "That's interesting! To better assist you, could you tell me:\n\n1️⃣ What type of clothing are you looking for? (Party, Wedding, Casual, Formal, etc.)\n2️⃣ What's your budget range?\n3️⃣ Any color or style preferences?\n\nI'm here to help you find the perfect outfit!"
        
        return "I'm here to help! Tell me:\n\n🛍️ What are you looking for? (Party wear, Wedding clothes, Casual, Formal, etc.)\n💰 What's your budget?\n🎨 Any color or style preference?\n\nI have amazing options for every occasion and budget!"
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
    
    def get_history(self):
        """Get conversation history"""
        return self.conversation_history


def get_deepseek_agent() -> DeepseekAgent:
    """Factory function to get Deepseek agent"""
    return DeepseekAgent()
