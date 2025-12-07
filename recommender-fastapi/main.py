# main.py - FastAPI Recommender Service with Deepseek AI
import sys
import os

# Fix encoding for Windows console
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
import json
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Import Deepseek Agent
try:
    from models.deepseek_agent import get_deepseek_agent
    HAS_DEEPSEEK = True
    print("[OK] Deepseek AI loaded")
except Exception as e:
    print(f"[WARNING] Deepseek not available: {e}")
    HAS_DEEPSEEK = False

# Load environment variables
load_dotenv()

# Global agent instance
deepseek_agent = None

# Initialize recommender model early - lazy load
recommender = None

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global deepseek_agent
    try:
        deepseek_agent = get_deepseek_agent()
        print("[✓] ABFRL Sales Agent (Deepseek) initialized successfully")
        print("[✓] Retail Genie Service Ready on http://localhost:8000")
    except Exception as e:
        print(f"[ERROR] Could not initialize agent: {e}")
        # Still try to create a basic agent
        try:
            deepseek_agent = get_deepseek_agent()
        except:
            print("[WARNING] Running without agent - using demo responses")
    yield
    # Shutdown
    print("[STOP] Retail Genie Service Stopped")

# Initialize FastAPI app
app = FastAPI(
    title="Retail-Genie-Prototype",
    description="AI-powered retail sales assistant with Deepseek",
    version="1.0.0",
    lifespan=lifespan
)

# Pydantic request model
class MessageRequest(BaseModel):
    user_message: str
    context: Optional[str] = ""

# Pydantic response model
class MessageResponse(BaseModel):
    success: bool
    response: str
    user_message: str
    model: str

# Health check endpoint
@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Retail Genie Deepseek AI",
        "version": "1.0.0",
        "ai_ready": HAS_DEEPSEEK
    }

# Main AI message endpoint
@app.post("/generate-message", response_model=MessageResponse)
def generate_message(request: MessageRequest):
    """
    Generate AI response using ABFRL Sales Agent (Deepseek)
    """
    try:
        user_message = request.user_message
        context = request.context
        
        if not user_message:
            raise ValueError("user_message is required")
        
        # Always use Deepseek agent (it has intelligent fallbacks)
        if deepseek_agent is None:
            raise ValueError("Agent not initialized")
        
        # Generate response using Deepseek agent
        response = deepseek_agent.generate_response(user_message)
        
        return MessageResponse(
            success=True,
            response=response,
            user_message=user_message,
            model="deepseek_abfrl"
        )
    
    except Exception as e:
        print(f"ERROR in /generate-message: {str(e)}")
        # Fallback response
        return MessageResponse(
            success=True,
            response="I'm having trouble processing that right now. Could you tell me what you're looking for? (Party wear, Wedding, Casual, etc.)",
            user_message=request.user_message if request else "error",
            model="deepseek_abfrl_error"
        )

# Conversation endpoint
@app.post("/chat")
def chat(request: MessageRequest):
    """Chat endpoint - alias for generate-message"""
    return generate_message(request)

# Clear history endpoint
@app.post("/clear-history")
def clear_history():
    """Clear conversation history"""
    global deepseek_agent
    if deepseek_agent:
        deepseek_agent.clear_history()
    return {"status": "history_cleared"}

# Get history endpoint
@app.get("/history")
def get_history():
    """Get conversation history"""
    global deepseek_agent
    if deepseek_agent:
        return {"history": deepseek_agent.get_history()}
    return {"history": []}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
