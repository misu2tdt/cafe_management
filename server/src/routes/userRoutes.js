import express from "express";
import {
  test,
  getAllUsers,
  getUserByIdController,
  createUserController,
  loginUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/test", test);
router.get("/", getAllUsers);
router.get("/:id", getUserByIdController);
router.post("/", createUserController);
router.post("/login", loginUserController);

export default router;