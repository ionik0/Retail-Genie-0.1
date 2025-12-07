import axios from 'axios';

// Get base URLs from environment or use defaults
const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:5000';
const RECOMMENDER_URL = import.meta.env.VITE_RECOMMENDER_URL || 'http://localhost:8000';

// Create axios instances
const orchestratorClient = axios.create({
  baseURL: ORCHESTRATOR_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const recommenderClient = axios.create({
  baseURL: RECOMMENDER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Orchestrator API calls
export const orchestratorAPI = {
  // Send message to orchestrator
  sendMessage: async (message, sessionId = null) => {
    try {
      const response = await orchestratorClient.post('/message', {
        message,
        session_id: sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('Orchestrator API Error:', error.message);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await orchestratorClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Orchestrator Health Check Error:', error.message);
      throw error;
    }
  },
};

// Recommender API calls
export const recommenderAPI = {
  // Get recommendations
  getRecommendations: async (query, filters = {}) => {
    try {
      const response = await recommenderClient.post('/recommend', {
        query,
        top_k: filters.top_k || 5,
        min_price: filters.min_price || null,
        max_price: filters.max_price || null,
        category: filters.category || null,
      });
      return response.data;
    } catch (error) {
      console.error('Recommender API Error:', error.message);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await recommenderClient.post('/search', {
        query,
        top_k: filters.top_k || 5,
        min_price: filters.min_price || null,
        max_price: filters.max_price || null,
        category: filters.category || null,
      });
      return response.data;
    } catch (error) {
      console.error('Recommender Search Error:', error.message);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await recommenderClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Get Products Error:', error.message);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await recommenderClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Get Product By ID Error:', error.message);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await recommenderClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Recommender Health Check Error:', error.message);
      throw error;
    }
  },

  // Send message to Deepseek chatbot (ABFRL Sales Agent)
  sendChatMessage: async (message) => {
    try {
      const response = await recommenderClient.post('/generate-message', {
        user_message: message,
        context: '',
      });
      return response.data;
    } catch (error) {
      console.error('Deepseek Chat Error:', error.message);
      throw error;
    }
  },
};

// Deepseek Chatbot API
export const deepseekAPI = {
  // Send message to ABFRL Sales Agent (Deepseek)
  sendMessage: async (message) => {
    try {
      const response = await recommenderClient.post('/generate-message', {
        user_message: message,
        context: '',
      });
      return response.data;
    } catch (error) {
      console.error('ABFRL Sales Agent Error:', error.message);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await recommenderClient.get('/');
      return response.data;
    } catch (error) {
      console.error('ABFRL Sales Agent Health Check Error:', error.message);
      throw error;
    }
  },
};

export default { orchestratorAPI, recommenderAPI, deepseekAPI };
