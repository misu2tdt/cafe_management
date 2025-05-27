import express from 'express'
import authMiddleware from '../middlewares/Auth.js'
import { getReportController, getDailyRevenueController } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/', authMiddleware, getReportController)
router.get('/daily-revenue', authMiddleware, getDailyRevenueController)


export default router