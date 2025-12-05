import { useState, useEffect, useRef } from 'react';
import productsData from '../data/products.json';
import inventoryData from '../data/inventory.json';
import promotionsData from '../data/promotions.json';
import { orchestratorAPI, recommenderAPI } from '../services/api';

const Chatbot = ({ customer, onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStage, setChatStage] = useState('greeting');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial greeting
    setTimeout(() => {
      addBotMessage(`Hello ${customer.name}! 👋 Welcome to ABFRL. I'm your AI sales assistant. How can I help you today?`);
      setTimeout(() => {
        addBotMessage("What are you looking for today? You can tell me:\n• Wear type: Party wear, Wedding wear, Street wear, Office wear, Casual, Traditional\n• Specific item: Kurtas, Shirts, Jeans, Shoes, Blazers, etc.\n• Or just describe what you need!");
        setChatStage('asking_occasion');
      }, 1500);
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text, type = 'text', data = null) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text,
      type,
      data,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date()
    }]);
  };

  const simulateTyping = (callback, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const getRecommendations = (occasion) => {
    // Simulate Recommendation Agent
    let recommendations = [];
    const lowerText = occasion.toLowerCase();
    
    // Helper function to check if product matches wear type
    const matchesWearType = (product, wearTypes) => {
      if (!wearTypes || wearTypes.length === 0) return false;
      if (product.wearType && Array.isArray(product.wearType)) {
        return wearTypes.some(wt => product.wearType.includes(wt));
      }
      return false;
    };
    
    // Check for specific product requests first
    if (lowerText.includes('kurta') || lowerText.includes('kurtas')) {
      recommendations = productsData.filter(p => 
        p.category === 'Kurtas' || p.name.toLowerCase().includes('kurta')
      );
      return recommendations.length > 0 ? recommendations : productsData.filter(p => p.category === 'Kurtas');
    } 
    // Party wear
    else if (lowerText.includes('party') || lowerText.includes('party wear')) {
      recommendations = productsData.filter(p => 
        matchesWearType(p, ['party']) || 
        p.name.toLowerCase().includes('party') ||
        (p.category === 'Wedding Wear' && matchesWearType(p, ['party']))
      );
      if (recommendations.length === 0) {
        // Fallback to party-related products
        recommendations = productsData.filter(p => 
          p.name.toLowerCase().includes('party') ||
          (p.category === 'Shirts' && p.name.toLowerCase().includes('sequin')) ||
          (p.category === 'Blazers' && p.name.toLowerCase().includes('metallic'))
        );
      }
    }
    // Wedding wear
    else if (lowerText.includes('wedding') || lowerText.includes('wedding wear') || lowerText.includes('marriage')) {
      recommendations = productsData.filter(p => 
        p.category === 'Wedding Wear' ||
        matchesWearType(p, ['wedding']) ||
        p.name.toLowerCase().includes('wedding') ||
        p.name.toLowerCase().includes('sherwani')
      );
      if (recommendations.length === 0) {
        recommendations = productsData.filter(p => 
          p.name.toLowerCase().includes('wedding') ||
          p.name.toLowerCase().includes('sherwani') ||
          (p.category === 'Kurtas' && p.name.toLowerCase().includes('embroidered'))
        );
      }
    }
    // Street wear
    else if (lowerText.includes('street') || lowerText.includes('street wear') || lowerText.includes('streetwear')) {
      recommendations = productsData.filter(p => 
        p.category === 'Street Wear' ||
        matchesWearType(p, ['street']) ||
        p.name.toLowerCase().includes('street')
      );
      if (recommendations.length === 0) {
        recommendations = productsData.filter(p => 
          p.name.toLowerCase().includes('street') ||
          p.name.toLowerCase().includes('hoodie') ||
          (p.category === 'T-Shirts' && p.name.toLowerCase().includes('graphic')) ||
          (p.category === 'Jeans' && p.name.toLowerCase().includes('ripped'))
        );
      }
    }
    // Product-specific requests
    else if (lowerText.includes('shirt') || lowerText.includes('shirts')) {
      recommendations = productsData.filter(p => 
        ['Shirts', 'T-Shirts'].includes(p.category)
      ).slice(0, 3);
    } else if (lowerText.includes('jean') || lowerText.includes('pant')) {
      recommendations = productsData.filter(p => 
        p.category === 'Jeans'
      ).slice(0, 3);
    } else if (lowerText.includes('shoe') || lowerText.includes('footwear')) {
      recommendations = productsData.filter(p => 
        p.category === 'Footwear'
      ).slice(0, 3);
    } else if (lowerText.includes('blazer') || lowerText.includes('jacket')) {
      recommendations = productsData.filter(p => 
        p.category === 'Blazers'
      ).slice(0, 3);
    } 
    // Occasion-based recommendations
    else if (lowerText.includes('office') || lowerText.includes('formal') || lowerText.includes('business')) {
      recommendations = productsData.filter(p => 
        ['Shirts', 'Blazers', 'Footwear'].includes(p.category) &&
        !matchesWearType(p, ['party', 'street'])
      ).slice(0, 3);
    } else if (lowerText.includes('casual')) {
      recommendations = productsData.filter(p => 
        ['T-Shirts', 'Jeans', 'Footwear'].includes(p.category) ||
        matchesWearType(p, ['casual'])
      ).slice(0, 3);
    } else if (lowerText.includes('traditional') || lowerText.includes('festival') || lowerText.includes('ethnic')) {
      recommendations = productsData.filter(p => 
        p.category === 'Kurtas' || matchesWearType(p, ['traditional'])
      ).slice(0, 3);
    } else {
      recommendations = productsData.slice(0, 3);
    }

    // Consider customer preferences
    if (customer.preferences?.categories?.length > 0 && recommendations.length < 3) {
      const preferred = productsData.filter(p => 
        customer.preferences.categories.includes(p.category)
      );
      if (preferred.length > 0) {
        recommendations = [...recommendations, ...preferred.slice(0, 3 - recommendations.length)];
      }
    }

    return recommendations.length > 0 ? recommendations.slice(0, 5) : productsData.slice(0, 3);
  };

  const checkInventory = (productId) => {
    // Simulate Inventory Agent
    const inventory = inventoryData[productId];
    if (!inventory) return null;

    const availableStores = Object.entries(inventory.stores)
      .filter(([_, data]) => data.available && data.stock > 0)
      .map(([store, _]) => store);

    return {
      warehouse: inventory.warehouse.stock > 0,
      stores: availableStores,
      warehouseStock: inventory.warehouse.stock
    };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    addUserMessage(userText);
    setInput('');

    setIsTyping(true);

    try {
      // Send message to orchestrator
      const response = await orchestratorAPI.sendMessage(userText, sessionId);
      
      // Update session ID if provided
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Handle recommendations from orchestrator
      if (response.cards && response.cards.length > 0) {
        setRecommendedProducts(response.cards);
        addBotMessage(response.response, 'recommendations', response.cards);
        setChatStage('showing_products');
      } else if (response.offers && response.offers.length > 0) {
        // Handle offers
        addBotMessage(response.response || 'Here are some offers for you!', 'text');
      } else {
        // Generic response
        addBotMessage(response.response || 'I understand. How else can I help?');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to local recommendation if API fails
      const recommendations = getRecommendations(userText);
      setRecommendedProducts(recommendations);
      
      if (recommendations.length > 0) {
        addBotMessage(
          `I found some great options for you:`,
          'recommendations',
          recommendations
        );
        setChatStage('showing_products');
      } else {
        addBotMessage(
          `I'm having trouble connecting to the recommendation service. Please try again.`
        );
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'check_inventory' && recommendedProducts.length > 0) {
      setInput('check inventory');
      handleSend({ preventDefault: () => {} });
    } else if (action === 'view_products') {
      onNavigate('products');
    } else if (action === 'checkout' && recommendedProducts.length > 0) {
      onNavigate('checkout', recommendedProducts[0]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Sales Assistant</h2>
              <p className="text-sm text-indigo-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {customer.name} • <span className="font-semibold">{customer.loyaltyTier}</span> Member
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🛍️ Browse Products
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl animate-slide-in ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 shadow-lg border border-gray-100'
              }`}
            >
              {msg.type === 'recommendations' && msg.data ? (
                <div className="space-y-3">
                  <p className="mb-2">{msg.text}</p>
                  {msg.data.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                      onClick={() => {
                        setSelectedProduct(product);
                        addBotMessage(`Great choice! ${product.name} - ₹${product.price}. Would you like to check inventory or proceed to checkout?`);
                        setChatStage('ready_to_checkout');
                      }}
                    >
                      <div className="font-bold text-gray-800 mb-1">{product.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-bold text-purple-600">₹{product.price}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{product.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-line">{msg.text}</p>
              )}
              <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {recommendedProducts.length > 0 && (
        <div className="px-4 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleQuickAction('check_inventory')}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-bold whitespace-nowrap hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              📦 Check Inventory
            </button>
            <button
              onClick={() => handleQuickAction('view_products')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full text-sm font-bold whitespace-nowrap hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              🛍️ View All Products
            </button>
            <button
              onClick={() => handleQuickAction('checkout')}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold whitespace-nowrap hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              💳 Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-2xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isTyping ? '⏳' : '🚀'} Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;

