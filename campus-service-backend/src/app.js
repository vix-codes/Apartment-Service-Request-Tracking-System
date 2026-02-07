const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server running" });
});

// Routes
app.use("/requests", requestRoutes);

// Error handler (MUST be last)
app.use(errorHandler);

module.exports = app;
