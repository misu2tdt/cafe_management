const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Cafe Management API");
});

module.exports = app;