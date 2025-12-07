#!/usr/bin/env python
"""
Comprehensive test for the AI Sales Agent trained model
Tests multiple conversation flows to verify contextual responses
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:5000"
HEADERS = {"Content-Type": "application/json"}

def log(msg, color=""):
    """Print timestamped log message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {msg}")

def test_conversation_flow(queries):
    """Test a series of queries and display responses"""
    session_id = None
    results = []
    
    for i, query in enumerate(queries, 1):
        try:
            payload = {
                "message": query,
                "session_id": session_id or None
            }
            
            log(f"Test {i}/{len(queries)}: {query}")
            response = requests.post(f"{BASE_URL}/message", json=payload, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                session_id = data.get("session_id")
                ai_response = data.get("response", "")
                products = data.get("cards", [])
                
                log(f"  Response: {ai_response[:100]}...", "green")
                log(f"  Products Found: {len(products)}", "green")
                log(f"  Session ID: {session_id}", "blue")
                
                results.append({
                    "query": query,
                    "response": ai_response,
                    "products": len(products),
                    "success": True
                })
            else:
                log(f"  Error: {response.status_code}", "red")
                results.append({
                    "query": query,
                    "success": False,
                    "error": response.text
                })
        
        except Exception as e:
            log(f"  Exception: {str(e)}", "red")
            results.append({
                "query": query,
                "success": False,
                "error": str(e)
            })
        
        time.sleep(0.5)
    
    return results

def main():
    print("\n" + "="*70)
    print("AI SALES AGENT - COMPREHENSIVE TEST")
    print("="*70 + "\n")
    
    # Test 1: Party Wear Conversation
    print("\n[TEST 1] Party Wear Shopping Flow")
    print("-" * 70)
    party_queries = [
        "Hi! I'm looking for party wear",
        "Show me something colorful and trendy",
        "Do you have anything under 5000?",
        "Can you recommend the best party dress?"
    ]
    party_results = test_conversation_flow(party_queries)
    
    # Test 2: Wedding Wear Conversation
    print("\n\n[TEST 2] Wedding Wear Shopping Flow")
    print("-" * 70)
    wedding_queries = [
        "I need wedding outfit ideas",
        "What's your best wedding collection?",
        "Show me traditional designs",
        "How much for the premium wedding wear?"
    ]
    wedding_results = test_conversation_flow(wedding_queries)
    
    # Test 3: Budget Shopping
    print("\n\n[TEST 3] Budget-Conscious Shopping Flow")
    print("-" * 70)
    budget_queries = [
        "Hi! I'm on a tight budget",
        "Show me everything under 2000",
        "Any discounts or sales?",
        "What's the cheapest item you have?"
    ]
    budget_results = test_conversation_flow(budget_queries)
    
    # Test 4: Mixed Intent
    print("\n\n[TEST 4] Mixed Intent Queries")
    print("-" * 70)
    mixed_queries = [
        "Do you have shoes?",
        "Any formal wear for office?",
        "I need help choosing",
        "What are your bestsellers?",
        "Can I return items?"
    ]
    mixed_results = test_conversation_flow(mixed_queries)
    
    # Summary
    print("\n\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    all_results = party_results + wedding_results + budget_results + mixed_results
    successful = sum(1 for r in all_results if r.get("success"))
    total_queries = len(all_results)
    total_products = sum(r.get("products", 0) for r in all_results if r.get("success"))
    
    print(f"\nTotal Queries: {total_queries}")
    print(f"Successful: {successful}/{total_queries}")
    print(f"Success Rate: {(successful/total_queries)*100:.1f}%")
    print(f"Total Products Found: {total_products}")
    
    # Check if responses are diverse
    responses = [r.get("response", "") for r in all_results if r.get("success")]
    unique_responses = len(set(responses))
    print(f"\nResponse Diversity:")
    print(f"  Total Responses: {len(responses)}")
    print(f"  Unique Responses: {unique_responses}")
    print(f"  Diversity Score: {(unique_responses/len(responses))*100:.1f}%")
    
    if unique_responses > len(responses) * 0.5:
        print("\n✅ TRAINED MODEL IS GENERATING DIVERSE RESPONSES!")
    else:
        print("\n⚠️  WARNING: Responses seem too similar (may need more training data)")
    
    print("\n" + "="*70)
    
    # Show sample responses
    print("\nSample Responses:")
    print("-" * 70)
    for i, result in enumerate(all_results[:5], 1):
        if result.get("success"):
            print(f"\n{i}. Query: {result['query']}")
            print(f"   Response: {result['response'][:150]}...")
    
    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTest interrupted by user")
    except Exception as e:
        print(f"\n\nFatal error: {str(e)}")
