import express from "express"
import dotenv from "dotenv"
import cors from "cors"
//all routes
import adminRoutes from "./routes/adminRoutes.js"
import moderatorRoutes from "./routes/moderatorRoutes.js"
import userRoutes from "./routes/userRoutes.js"

// Load environment variables from.env file
dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000
//middleware
app.use(cors())
app.use(express.json())

//db connection
import connectDB from "./config/db.js"
connectDB()

//routes
app.use("/api/admins", adminRoutes)
app.use("/api/moderators", moderatorRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => {
  res.send("Serever is running")
})
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
