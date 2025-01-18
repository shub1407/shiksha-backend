import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
//all routes
import loginRoutes from "./routes/loginRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import moderatorRoutes from "./routes/moderatorRoutes.js"
import teacherRoutes from "./routes/teacherRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
// Load environment variables from.env file

dotenv.config()
const app = express()
app.use(
  cors({
    origin: "https://shiksha-frontend-one.vercel.app",
    credentials: true,
  })
)
const PORT = process.env.PORT || 4000
//middleware
app.use(cookieParser())

app.use(express.json())

//db connection
import connectDB from "./config/db.js"
connectDB()

//routes
app.use("/api", loginRoutes)
app.use("/api/admins", adminRoutes)
app.use("/api/moderators", moderatorRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/attendance", attendanceRoutes)

app.get("/", (req, res) => {
  res.send("Serever is running")
})
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
