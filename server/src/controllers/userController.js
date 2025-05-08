import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export const test = (req, res) => {
  res.send("User controller is working!");
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // hoặc include: { Customer: true }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

export const getUserByIdController = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    user ? res.json(user) : res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const createUserController = async (req, res) => {
  const { fullname, email, password, phone, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Mã hóa
    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword, // Lưu password đã mã hóa
        phone,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};

