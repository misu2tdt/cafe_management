import express from "express"
import authRoutes from "./routes/authRoutes.js"
import auth from "./middlewares/Auth.js"
import userRoutes from "./routes/userRoutes.js"

import dotenv from "dotenv"
dotenv.config({ path: "../.env" })

const app = express()

app.use(express.json())

app.use("/auth", authRoutes)
// sau khi login nếu thì dùng auth như sau 
app.use("/user", auth, userRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to Cafe Management API")
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
