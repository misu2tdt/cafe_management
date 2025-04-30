import { UserModel } from "../models/userModel.js"

export const test = (req, res) => {
  res.send("User controller is working!")
}

export const getAllUsers = (req, res) => {
  const users = userModel.getAll()
  res.json(users)
}