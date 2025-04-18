const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});

module.exports = app;
