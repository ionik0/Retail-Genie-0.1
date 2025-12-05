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
    setCurrentPage('chat');
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
    setCurrentPage('products');
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
    <div className="App">
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
    </div>
  );
}

export default App;

