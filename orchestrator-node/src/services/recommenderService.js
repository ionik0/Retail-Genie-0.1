const axios = require('axios');
const { RECOMMENDER_URL } = require('../config/env');

exports.getRecommendations = async (query, filters = {}) => {
    try {
        const payload = {
            query,
            top_k: filters.limit || filters.top_k || 5,
            min_price: filters.min_price || null,
            max_price: filters.maxPrice || null,
            category: filters.category || null
        };

        console.log(`[Recommender] Calling ${RECOMMENDER_URL}/recommend with query:`, query);

        const res = await axios.post(`${RECOMMENDER_URL}/recommend`, payload, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('[Recommender] Response received:', {
            count: res.data?.count || 0,
            query: res.data?.query_used
        });

        // Handle response format from FastAPI
        const results = res.data.results || [];
        
        return Array.isArray(results) ? results : [];
    } catch (err) {
        console.error('[Recommender ERROR]', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: `${RECOMMENDER_URL}/recommend`,
            query: query
        });
        
        // Fallback: return empty array to trigger fallback response
        return [];
    }
};
