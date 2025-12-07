import { useState, useEffect } from 'react';
import CustomerLogin from './components/CustomerLogin';
import Chatbot from './components/Chatbot';
import ProductsPage from './components/ProductsPage';
import Checkout from './components/Checkout';
import OrderSummary from './components/OrderSummary';
import PostPurchaseSupport from './components/PostPurchaseSupport';
import './services/debug'; // Import debug utilities for browser console access

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [customer, setCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fulfillmentOption, setFulfillmentOption] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Check if customer is already logged in
    const savedCustomer = localStorage.getItem('currentCustomer');
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
      setCurrentPage('chat');
    }
  }, []);

  const handleLogin = (customerData) => {
    setCustomer(customerData);
    localStorage.setItem('currentCustomer', JSON.stringify(customerData));
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setCustomer(null);
    setSelectedProduct(null);
    setFulfillmentOption(null);
    setOrder(null);
    localStorage.removeItem('currentCustomer');
    setCurrentPage('login');
  };

  const handleNavigate = (page, product = null, fulfillment = null) => {
    if (product) {
      setSelectedProduct(product);
    }
    if (fulfillment) {
      setFulfillmentOption(fulfillment);
    } else if (page === 'checkout') {
      setFulfillmentOption('ship_to_home'); // Default
    }
    setCurrentPage(page);
  };

  const handleOrderComplete = (orderData) => {
    setOrder(orderData);
    setCurrentPage('order-confirmation');
  };

  const handleTrackOrder = () => {
    setCurrentPage('post-purchase');
  };

  const handleReturnItem = () => {
    setCurrentPage('post-purchase');
  };

  const handleGiveFeedback = () => {
    setCurrentPage('post-purchase');
  };

  const handleBackToShop = () => {
    setCurrentPage('chat');
    setSelectedProduct(null);
    setOrder(null);
  };

  const handleBack = () => {
    if (currentPage === 'checkout') {
      setCurrentPage('products');
    } else if (currentPage === 'post-purchase') {
      setCurrentPage('order-confirmation');
    }
  };

  return (
    <div className="App bg-gray-50 min-h-screen">
      {/* Header with Logout (visible when logged in) */}
      {customer && currentPage !== 'login' && (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <h1 className="text-2xl font-bold">AI Sales Agent</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">👤 {customer.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={currentPage === 'login' ? '' : 'max-w-7xl mx-auto'}>
        {currentPage === 'login' && (
          <CustomerLogin onLogin={handleLogin} />
        )}

        {currentPage === 'chat' && customer && (
          <Chatbot
            customer={customer}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'products' && customer && (
          <ProductsPage
            customer={customer}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'checkout' && customer && (
          <Checkout
            product={selectedProduct}
            customer={customer}
            onOrderComplete={handleOrderComplete}
            onBack={handleBack}
            fulfillmentOption={fulfillmentOption}
          />
        )}

        {currentPage === 'order-confirmation' && (
          <OrderSummary
            order={order}
            onTrackOrder={handleTrackOrder}
            onReturnItem={handleReturnItem}
            onGiveFeedback={handleGiveFeedback}
            onBackToShop={handleBackToShop}
          />
        )}

        {currentPage === 'post-purchase' && (
          <PostPurchaseSupport
            order={order}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;

