import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/userDB.js'

/**
 * Đăng ký người dùng mới
 */
export const register = async(req, res) => {
    const { fullname, phone, email, password } = req.body
    
    if (!email || !password || !fullname || !phone) {
        return res.status(400).json({ message: "All fields are required" })
    }
    
    try {
        const existingUser = await UserModel.findByEmail(email)
        
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = {
            fullname,
            phone,
            email,
            password: hashedPassword,
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
        const user = await UserModel.findByEmail(email)
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        
        const token = jwt.sign(
            { 
                id: user.fullname,
                role: user.role
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        )
        
        res.json({ 
            token,
            // check trả về đúng không
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
