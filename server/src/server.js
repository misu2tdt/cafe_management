import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import auth from "./middlewares/Auth.js"

dotenv.config({ path: "../.env" })

const app = express()
app.use(express.json())

// Public routes (không cần token)
app.use("/auth", authRoutes)
app.use("/api/users", userRoutes) // ← không dùng auth ở đây

// Protected routes (dùng token)
app.use("/user", auth, userRoutes)
app.use("/api/orders", auth, orderRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to Cafe Management API")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
