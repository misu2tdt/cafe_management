import express from "express";
import {
  getAllOrdersController,
  getOrderByIdController,
  createOrderController,
  updateOrderStatusController,
  deleteOrderController,
} from "../controllers/orderController.js";

import authMiddleware from "../middlewares/Auth.js";
import { staffOnly } from "../middlewares/Role.js"; 

const router = express.Router();

router.get("/", authMiddleware, staffOnly, getAllOrdersController);
router.get("/:id", authMiddleware, staffOnly, getOrderByIdController);
router.post("/", authMiddleware, createOrderController); // nếu cho phép staff tạo
router.put("/:id/status", authMiddleware, staffOnly, updateOrderStatusController);
router.delete("/:id", authMiddleware, staffOnly, deleteOrderController);

export default router;
