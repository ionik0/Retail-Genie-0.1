"""
Trained Sales Agent Inference Engine
Uses the trained model to generate responses
"""

import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForCausalLM

class TrainedSalesAgent:
    """Sales agent using trained language model"""
    
    def __init__(self, model_path="trained_models/final_model"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = Path(model_path)
        
        print(f"[INIT] Loading trained model from {self.model_path}")
        print(f"[INIT] Device: {self.device}")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(str(self.model_path))
            self.model = AutoModelForCausalLM.from_pretrained(str(self.model_path))
            self.model.to(self.device)
            self.model.eval()
            print("[OK] Model loaded successfully")
        except Exception as e:
            print(f"[ERROR] Failed to load model: {e}")
            raise
    
    def generate_response(self, customer_message: str, max_length=100, temperature=0.7) -> str:
        """Generate sales agent response to customer message"""
        try:
            # Format input for the model
            prompt = f"Customer: {customer_message}\nAgent:"
            
            # Tokenize
            inputs = self.tokenizer.encode(prompt, return_tensors="pt").to(self.device)
            
            # Generate with proper parameters
            with torch.no_grad():
                output_ids = self.model.generate(
                    inputs,
                    max_length=min(len(inputs[0]) + 50, 150),  # Don't generate too long
                    temperature=max(0.5, temperature),  # Ensure some randomness
                    top_p=0.9,
                    top_k=40,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                )
            
            # Decode response
            full_response = self.tokenizer.decode(output_ids[0], skip_special_tokens=True)
            
            # Extract only the agent's response (after "Agent:")
            if "Agent:" in full_response:
                response = full_response.split("Agent:")[-1].strip()
            else:
                response = full_response[len(prompt):].strip()
            
            # Clean up response
            lines = response.split("\n")
            response = lines[0] if lines else response
            
            # Ensure we have a response
            if not response or len(response) < 5:
                # Use contextual fallback
                return self._get_contextual_response(customer_message)
            
            return response[:200].strip()
            
        except Exception as e:
            print(f"[ERROR] Generation failed: {e}")
            return self._get_contextual_response(customer_message)
    
    def _get_contextual_response(self, msg: str) -> str:
        """Fallback contextual response based on message"""
        msg_lower = msg.lower()
        
        if any(w in msg_lower for w in ['party', 'celebration']):
            return "🎉 Great! Our party wear collection is amazing. What's your style preference?"
        elif any(w in msg_lower for w in ['wedding', 'bride']):
            return "💍 Wonderful! Our wedding collection is beautiful. Traditional or modern style?"
        elif any(w in msg_lower for w in ['office', 'formal']):
            return "💼 Professional wear - perfect! What's your preferred style?"
        elif any(w in msg_lower for w in ['casual']):
            return "👕 Casual comfort! Let me show you our comfy options."
        elif any(w in msg_lower for w in ['shoe', 'footwear']):
            return "👟 Amazing shoe selection! What type are you looking for?"
        elif any(w in msg_lower for w in ['price', 'budget', 'under']):
            return "💰 Great! What's your budget? I'll find perfect options!"
        elif any(w in msg_lower for w in ['help']):
            return "🤝 I'm here to help! Tell me what you need and I'll find it!"
        else:
            return "✨ Absolutely! Tell me more about what you're looking for and I'll help!"
    
    def rank_customer_intent(self, customer_message: str) -> str:
        """Detect customer intent from message"""
        msg_lower = customer_message.lower()
        
        if any(w in msg_lower for w in ['party', 'celebration', 'event']):
            return "party_wear"
        elif any(w in msg_lower for w in ['wedding', 'bride', 'ceremony']):
            return "wedding"
        elif any(w in msg_lower for w in ['office', 'formal', 'work', 'corporate']):
            return "formal"
        elif any(w in msg_lower for w in ['casual', 'everyday', 'comfort']):
            return "casual"
        elif any(w in msg_lower for w in ['shoe', 'footwear', 'boot']):
            return "shoes"
        elif any(w in msg_lower for w in ['price', 'cost', 'budget', 'under', 'cheap']):
            return "price_inquiry"
        elif any(w in msg_lower for w in ['help', 'guide', 'how', 'assist']):
            return "help"
        elif any(w in msg_lower for w in ['buy', 'purchase', 'checkout', 'cart']):
            return "purchase"
        else:
            return "browse"
    
    def get_contextual_response(self, customer_message: str) -> dict:
        """Generate response with context"""
        intent = self.rank_customer_intent(customer_message)
        response = self.generate_response(customer_message)
        
        return {
            "response": response,
            "intent": intent,
            "model": "trained_sales_agent"
        }

# Global instance
_agent = None

def get_trained_agent():
    """Get or create trained agent instance"""
    global _agent
    if _agent is None:
        try:
            _agent = TrainedSalesAgent()
        except Exception as e:
            print(f"[WARNING] Could not load trained model: {e}")
            return None
    return _agent
