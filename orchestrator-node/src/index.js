const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");
const { handleMessage } = require("./controllers/messageController");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Orchestrator Running"));

app.post("/message", handleMessage);

app.listen(PORT, () => {
    console.log(`Orchestrator live on port ${PORT}`);
});
