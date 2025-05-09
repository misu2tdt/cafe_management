import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"

import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

const app = express()
// Middleware
app.use(express.json())
app.use(cors())

// Đăng ký và đăng nhập người dùng mới
app.use("/api", userRoutes)

// Chỉnh sửa menu
app.use("/api/menuItem", menuRoutes)


app.get("/", (req, res) => {
  res.send("Welcome to Cafe Management API")
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
