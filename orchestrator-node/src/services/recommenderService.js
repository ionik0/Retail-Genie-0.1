const axios = require('axios');
const { RECOMMENDER_URL } = require('../config/env');

exports.getRecommendations = async (query, filters = {}) => {
    try {
        const payload = {
            query,
            top_k: filters.top_k || 5,
            min_price: filters.min_price || null,
            max_price: filters.max_price || null,
            category: filters.category || null
        };

        console.log(`[Recommender] Calling ${RECOMMENDER_URL} with:`, payload);

        const res = await axios.post(RECOMMENDER_URL, payload, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('[Recommender] Response:', res.data);

        // Handle both response formats
        const results = res.data.results || res.data.items || [];
        
        return Array.isArray(results) ? results : [];
    } catch (err) {
        console.error('[Recommender ERROR]', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: RECOMMENDER_URL
        });
        return [];
    }
};
