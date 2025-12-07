const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { PORT } = require("./config/env");
const { handleMessage } = require("./controllers/messageController");
const { handlePostPurchase, getHealthStatus } = require("./controllers/postPurchaseController");
const {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleGetProfile,
    handleUpdateProfile,
    handleGetAddresses,
    handleAddAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleUpdateGPS,
    handleToggleGPS,
    handleFindNearbyStores,
    handleGetAllStores,
    handleCheckAvailability,
    handleSearchNearbyProducts,
    handleUpdatePreferences
} = require("./controllers/authController");

const { verifyToken, optionalVerifyToken } = require("./middleware/authMiddleware");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Security and parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => res.json({ 
    success: true,
    message: "Retail-Genie Orchestrator Running",
    status: 200,
    version: "1.0.0",
    timestamp: new Date().toISOString()
}));

// ==================== AUTHENTICATION ROUTES ====================
app.post("/auth/register", handleRegister);
app.post("/auth/login", handleLogin);
app.post("/auth/refresh-token", handleRefreshToken);
app.post("/auth/logout", verifyToken, handleLogout);

// ==================== PROFILE ROUTES ====================
app.get("/auth/profile", verifyToken, handleGetProfile);
app.put("/auth/profile", verifyToken, handleUpdateProfile);

// ==================== ADDRESS MANAGEMENT ROUTES ====================
app.get("/auth/addresses", verifyToken, handleGetAddresses);
app.post("/auth/addresses", verifyToken, handleAddAddress);
app.put("/auth/addresses/:addressId", verifyToken, handleUpdateAddress);
app.delete("/auth/addresses/:addressId", verifyToken, handleDeleteAddress);

// ==================== GPS & LOCATION ROUTES ====================
app.post("/location/gps/update", verifyToken, handleUpdateGPS);
app.post("/location/gps/toggle", verifyToken, handleToggleGPS);
app.get("/location/nearby-stores", verifyToken, handleFindNearbyStores);
app.get("/location/stores", handleGetAllStores);
app.post("/location/check-availability", handleCheckAvailability);

// ==================== PREFERENCES ROUTES ====================
app.post("/auth/preferences", verifyToken, handleUpdatePreferences);

// ==================== SHOPPING AGENT ROUTES (with optional location awareness) ====================
app.post("/message", optionalVerifyToken, handleMessage);
app.post("/location/search", verifyToken, handleSearchNearbyProducts);

// ==================== POST-PURCHASE AGENT ROUTES ====================
app.get("/post-purchase/health", getHealthStatus);
app.post("/post-purchase", handlePostPurchase);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Orchestrator running on port ${PORT}`);
    console.log(`📍 API Base: http://localhost:${PORT}`);
    console.log(`🔐 JWT Authentication: Enabled`);
    console.log(`📍 GPS Tracking: Enabled`);
    console.log(`🛍️  E-Commerce Features: Ready`);
});
