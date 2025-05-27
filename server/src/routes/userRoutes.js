import express from 'express'
import { register, login, getAllEmployees, updateEmployee } from '../controllers/userController.js'
import authMiddleware from '../middlewares/Auth.js'

const router = express.Router()

// Đăng ký người dùng mới
router.post('/register', register)
// Đăng nhập
router.post('/login', login)

router.put('/:id', authMiddleware, updateEmployee)
router.get('/employees', authMiddleware, getAllEmployees)

export default router