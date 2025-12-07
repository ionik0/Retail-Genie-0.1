# AI Sales Agent - Uses Hugging Face Inference API for intelligent responses
import requests
import json
import os
from typing import List, Optional

class AISalesAgent:
    """
    AI-powered sales agent using Hugging Face's inference API
    Generates intelligent, contextual product recommendations and responses
    """
    
    def __init__(self):
        # Use free Hugging Face Inference API - no key needed for public models
        # Or set your own token via HUGGINGFACE_TOKEN environment variable
        self.hf_token = os.getenv('HUGGINGFACE_TOKEN', None)
        
        # Using Mistral-7B via Hugging Face (excellent for sales conversations)
        self.model_name = "mistralai/Mistral-7B-Instruct-v0.1"
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_name}"
        
        # System prompt for sales agent
        self.system_prompt = """You are an expert retail sales agent for a fashion and clothing store. 
You are friendly, professional, and always focused on helping customers find the perfect products.
You ALWAYS provide positive, helpful responses and suggest relevant products.
Keep responses concise (2-3 sentences) and engaging.
If customer asks about products, ALWAYS recommend something positive.
Use emojis occasionally for friendliness.
Never say "I don't know" - always offer helpful alternatives."""
        
    def generate_response(self, user_message: str, context: str = "") -> str:
        """
        Generate intelligent sales response using Hugging Face API
        Falls back to local generation if API fails
        """
        try:
            headers = {}
            if self.hf_token:
                headers["Authorization"] = f"Bearer {self.hf_token}"
            
            # Construct the prompt
            full_prompt = f"""{self.system_prompt}

Customer: {user_message}
{context}

Sales Agent:"""
            
            payload = {
                "inputs": full_prompt,
                "parameters": {
                    "max_new_tokens": 100,
                    "temperature": 0.7,
                    "top_p": 0.9,
                }
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get('generated_text', '')
                    # Extract only the sales agent response
                    if 'Sales Agent:' in generated_text:
                        response_text = generated_text.split('Sales Agent:')[-1].strip()
                    else:
                        response_text = generated_text.strip()
                    
                    return response_text[:200]  # Limit length
            
        except Exception as e:
            print(f"[HF API Error] {str(e)}")
        
        # Fallback to local intelligent response
        return self._generate_local_response(user_message, context)
    
    def _generate_local_response(self, user_message: str, context: str = "") -> str:
        """Local fallback response generation with AI-like intelligence"""
        msg_lower = user_message.lower()
        
        # Smart detection based on keywords
        if any(word in msg_lower for word in ['hi', 'hello', 'hey', 'greet']):
            responses = [
                "🎉 Welcome! I'm thrilled to help you find amazing fashion today! What style are you looking for?",
                "👋 Hey there! Let's find the perfect outfit for you. What catches your interest?",
                "✨ Welcome to our store! Looking for something specific or want to explore our latest collection?",
            ]
            import random
            return random.choice(responses)
        
        if any(word in msg_lower for word in ['party', 'wedding', 'formal', 'occasion', 'event']):
            return "🎊 Perfect! For special occasions, we have stunning dress wear, elegant blazers, and sophisticated pieces. What's the event? I'll find you something gorgeous!"
        
        if any(word in msg_lower for word in ['casual', 'everyday', 'comfort', 'relax']):
            return "👕 Great choice! Our casual collection includes comfy tees, relaxed fits, and stylish basics. Want me to show you our best-sellers?"
        
        if any(word in msg_lower for word in ['shoe', 'footwear', 'boot', 'sandal']):
            return "👞 Excellent! We have an amazing shoe collection - from elegant formal wear to comfy casual kicks. What style are you after?"
        
        if any(word in msg_lower for word in ['price', 'cost', 'budget', 'afford', 'expensive']):
            return "💰 We have something for every budget! From amazing value basics at ₹500 to premium designer pieces. What's your price range? I'll find perfect options!"
        
        if any(word in msg_lower for word in ['help', 'assist', 'guide', 'suggest']):
            return "🤝 I'm here to help! Tell me: What occasion? What style? What budget? I'll recommend perfect products for you!"
        
        if any(word in msg_lower for word in ['new', 'latest', 'trending', 'popular', 'best']):
            return "🔥 Great timing! Our latest collection is selling fast! We have trending items in all categories. Want to see what's hot right now?"
        
        if any(word in msg_lower for word in ['search', 'find', 'look', 'show', 'product']):
            return "🛍️ Absolutely! I'll help you find exactly what you're looking for. Tell me more about your style preference!"
        
        if any(word in msg_lower for word in ['thank', 'thanks', 'appreciate']):
            return "😊 You're welcome! Remember, I'm here to help anytime. Let me know what you'd like to explore!"
        
        # Default positive response
        return "😊 That's interesting! I'd love to help you find the perfect items. Could you tell me more about what you're looking for? I have some amazing suggestions!"
    
    def rank_products(self, query: str, products: List[dict]) -> List[dict]:
        """
        Intelligently rank products based on query relevance
        Returns products sorted by relevance score
        """
        try:
            # Use sentence-transformers for semantic similarity
            from sentence_transformers import util, SentenceTransformer
            
            model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Encode query and product names/descriptions
            query_embedding = model.encode(query, convert_to_tensor=True)
            
            scored_products = []
            for product in products:
                product_text = f"{product.get('name', '')} {product.get('category', '')} {product.get('description', '')}"
                product_embedding = model.encode(product_text, convert_to_tensor=True)
                
                # Calculate similarity
                similarity = util.pytorch_cos_sim(query_embedding, product_embedding)
                score = float(similarity[0][0])
                
                scored_products.append((score, product))
            
            # Sort by score descending
            scored_products.sort(key=lambda x: x[0], reverse=True)
            return [p[1] for p in scored_products]
            
        except Exception as e:
            print(f"[Ranking Error] {str(e)}")
            return products  # Return unsorted on error
    
    def generate_product_description(self, product: dict) -> str:
        """Generate an AI sales pitch for a product"""
        try:
            name = product.get('name', 'Item')
            price = product.get('price', 'N/A')
            category = product.get('category', 'fashion')
            
            # Smart selling pitch
            pitches = [
                f"✨ Check out this gorgeous {name} - just ₹{price}! Perfect for your style!",
                f"🎯 {name} at ₹{price} - exactly what you're looking for!",
                f"💎 This stunning {category} piece {name} is now just ₹{price}!",
                f"🔥 {name} - ₹{price}. It's flying off the shelves!",
            ]
            
            import random
            return random.choice(pitches)
            
        except Exception as e:
            return f"Great choice: {product.get('name', 'Item')} - ₹{product.get('price', 'N/A')}"

# Initialize global agent
_agent = None

def get_sales_agent():
    """Get or create the AI sales agent instance"""
    global _agent
    if _agent is None:
        _agent = AISalesAgent()
    return _agent
