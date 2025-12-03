const axios = require('axios');
const { RECOMMENDER_URL } = require('../config/env');

exports.getRecommendations = async (query, filters = {}) => {
    try {
        const res = await axios.post(RECOMMENDER_URL, {
            query,
            top_k: 5,
            min_price: filters.min_price || null,
            max_price: filters.max_price || null,
            category: filters.category || null
        });

        return res.data.results || [];
    } catch (err) {
        console.log("[Recommender ERROR]", err.message);
        return [];
    }
};
