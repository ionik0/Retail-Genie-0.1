const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const { handleMessage } = require("./controllers/messageController");
const { handlePostPurchase, getHealthStatus } = require("./controllers/postPurchaseController");
const { 
    handleRegister, 
    handleLogin, 
    handleLogout,
    handleGetProfile,
    handleAddAddress,
    handleUpdateGPS,
    handleToggleGPS,
    handleUpdatePreferences,
    handleFindNearbyStores,
    handleGetAllStores,
    handleCheckAvailability,
    handleSearchNearbyProducts
} = require("./controllers/authController");

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => res.send("OmniSell Orchestrator Running"));

// Authentication Routes
app.post("/auth/register", handleRegister);
app.post("/auth/login", handleLogin);
app.post("/auth/logout", handleLogout);
app.post("/auth/profile", handleGetProfile);

// Address Management Routes
app.post("/auth/address/add", handleAddAddress);

// GPS & Location Routes
app.post("/location/gps/update", handleUpdateGPS);
app.post("/location/gps/toggle", handleToggleGPS);
app.post("/location/nearby-stores", handleFindNearbyStores);
app.get("/location/stores", handleGetAllStores);
app.post("/location/check-availability", handleCheckAvailability);

// Preferences Routes
app.post("/auth/preferences/update", handleUpdatePreferences);

// Shopping Agent Routes (with location awareness)
app.post("/message", handleMessage);
app.post("/location/search", handleSearchNearbyProducts);

// Post-Purchase Agent Routes
app.get("/post-purchase/health", getHealthStatus);
app.post("/post-purchase", handlePostPurchase);

app.listen(PORT, () => {
    console.log(`Orchestrator live on port ${PORT}`);
});
