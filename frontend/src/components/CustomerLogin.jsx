import { useState } from 'react';
import customersData from '../data/customers.json';

const CustomerLogin = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Find customer or create new one
      let customer = customersData.find(c => 
        c.name.toLowerCase() === name.toLowerCase()
      );
      
      if (!customer) {
        // Create a new customer profile
        customer = {
          id: `C${String(customersData.length + 1).padStart(3, '0')}`,
          name: name,
          email: `${name.toLowerCase().replace(' ', '')}@example.com`,
          phone: '+91 98765 43210',
          loyaltyTier: 'Silver',
          loyaltyPoints: 0,
          pastPurchases: [],
          preferences: {
            categories: [],
            priceRange: '1000-5000',
            colors: []
          },
          devicePreference: 'web'
        };
      }

      // Store in localStorage
      localStorage.setItem('currentCustomer', JSON.stringify(customer));
      onLogin(customer);
    }
  };

  const handleQuickSelect = (customer) => {
    setSelectedCustomer(customer);
    setName(customer.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-slide-in border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse-glow">
              <span className="text-4xl">🤖</span>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI Retail Sales Agent
          </h1>
          <p className="text-gray-600 font-medium">ABFRL - Start Your Shopping Journey</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>AI-Powered Shopping Experience</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rajesh Kumar"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95"
          >
            🚀 Start Chat
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select (Demo):</p>
          <div className="space-y-2">
            {customersData.slice(0, 3).map((customer, index) => (
              <button
                key={customer.id}
                onClick={() => handleQuickSelect(customer)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-102 ${
                  selectedCustomer?.id === customer.id
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{customer.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.loyaltyTier === 'Platinum' ? 'bg-yellow-100 text-yellow-800' :
                        customer.loyaltyTier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.loyaltyTier}
                      </span>
                      {' '}• {customer.loyaltyPoints} points
                    </div>
                  </div>
                  {selectedCustomer?.id === customer.id && (
                    <span className="text-purple-600 text-xl">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;

