import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/userModel.js'

/**
 * Đăng ký người dùng mới
 */
export const register = async(req, res) => {
    const { fullname, phone, email, password } = req.body
    
    if (!email || !password || !fullname || !phone) {
        return res.status(400).json({ message: "All fields are required" })
    }
    
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await UserModel.findByEmail(email)
        
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Tạo user với role mặc định là CUSTOMER
        const userData = {
            fullname,
            phone,
            email,
            password: hashedPassword,
            // Không cần chỉ định role vì trong model đã mặc định là CUSTOMER
        }
        
        const insertedUser = await UserModel.createUser(userData)

        // Create JWT token
        const token = jwt.sign(
            { 
                id: insertedUser.id,
                role: insertedUser.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ 
            token,
            user: {
                id: insertedUser.id,
                fullname: insertedUser.fullname,
                email: insertedUser.email,
                role: insertedUser.role
            }
        })
    } catch (error) {
        console.error("Register error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}

/**
 * Đăng nhập người dùng
 */
export const login = async(req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }
    
    try {
        // Sử dụng UserModel để tìm user theo email
        const user = await UserModel.findByEmail(email)
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        
        // So sánh mật khẩu đã hash
        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        
        // Tạo token với thông tin user ID và role
        const token = jwt.sign(
            { 
                id: user.id,
                role: user.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        )
        
        res.json({ 
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}
