import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const register = async (req, res) => {
    const { fullname, phone, email, password } = req.body

    if (!email || !password || !fullname || !phone) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                fullname,
                phone,
                email,
                password: hashedPassword,
                role: 'CUSTOMER',
                Customer: {
                    create: {}
                }
            },
            include: {
                Customer: true
            }
        })

        const token = jwt.sign(
            {
                id: newUser.id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.status(201).json(token)
    } catch (error) {
        console.error("Register error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(201).json(token)
    } catch (error) {
        console.error("Login error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.user.findMany({
            where: { role: 'EMPLOYEE' },
            include: { Employee: true }
        })

        const Employees = employees.map(({ password, ...rest }) => rest)

        res.status(200).json({
            success: true,
            employees: Employees
        })
    } catch (error) {
        console.error("Get all employees error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}

export const updateEmployee = async (req, res) => {
    const userId = req.params.id
    const { fullname, phone, email, salary } = req.body

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" })
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: { Employee: true }
        })

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        if (existingUser.role !== 'EMPLOYEE') {
            return res.status(400).json({ message: "User is not an employee" })
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                fullname,
                phone,
                email,
                Employee: {
                    update: {
                        data: { salary: Number(salary) }
                    }
                }
            },
            include: { Employee: true }
        })
        const { password, ...userInfo } = updatedUser

        res.status(200).json({
            success: true,
            user: userInfo
        })
    } catch (error) {
        console.error("Update employee error:", error)
        res.status(503).json({ message: "Service unavailable", error: error.message })
    }
}