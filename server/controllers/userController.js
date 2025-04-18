const userModel = require("../models/userModel");

exports.getAllUsers = (req, res) => {
  const users = userModel.getAll();
  res.json(users);
};