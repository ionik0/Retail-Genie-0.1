require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,
    RECOMMENDER_URL: process.env.RECOMMENDER_URL || "http://localhost:8000/recommend",
    MONGO_URI: process.env.MONGO_URI || "",
    DB_NAME: process.env.DB_NAME || "omnisell"
};
