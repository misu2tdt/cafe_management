import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"

dotenv.config({ path: "../.env" })

const app = express()

app.use(express.json())
app.use(cors())


app.use("/users", userRoutes)

app.use("/menuItems", menuRoutes)
app.use("/images", express.static('uploads'))

app.use("/orders", orderRoutes)

app.use("/dashboard", dashboardRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to Cafe Management API")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
