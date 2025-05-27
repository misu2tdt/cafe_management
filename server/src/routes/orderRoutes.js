import express from "express"
import {
  getAllOrdersController,
  getOrderByIdController,
  createOrderController,
  updateOrderStatusController,
  getMyOrdersController
} from "../controllers/orderController.js"

import authMiddleware from "../middlewares/Auth.js"


const router = express.Router()

router.get("/", authMiddleware, getAllOrdersController)
router.get("/:id", authMiddleware, getOrderByIdController)
router.get("/customer/myOrders", authMiddleware, getMyOrdersController)
router.post("/", authMiddleware, createOrderController)
router.put("/:id/status", authMiddleware, updateOrderStatusController)

export default router
