import Teacher from "../models/Teacher.js"
import Moderator from "../models/Moderator.js"
import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body
    let model
    if (role === "admin") model = Admin
    if (role === "moderator") model = Moderator
    if (role === "teacher") model = Teacher
    console.log(model)
    const user = await model.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" })
    }
    const token = jwt.sign(
      { id: user._id, role, email },
      process.env.JWT_SECRET
    )
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, // 1 day in milliseconds (optional if expiresIn is set in JWT)
      path: "/", // Cookie is accessible on the whole site
    })
    res
      .status(200)
      .json({ error: false, data: user, message: "Login successful", token })
  } catch (error) {
    console.log(error)
  }
}
export const authStatus = async (req, res) => {
  console.log(req.cookies.token)
  const token = req.cookies.token
  if (!token) {
    return res.status(200).json({
      error: true,
      message: "missing token",
      data: {
        authenticated: false,
        user: {},
      },
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    res.status(200).json({
      error: false,
      message: "Token is valid",
      data: {
        authenticated: true,
        user: decoded,
      },
    })
  } catch (error) {
    res.status(200).json({
      error: true,
      message: "Invalid token",
      data: {
        authenticated: false,
        user: {},
      },
    })
    console.log(error)
  }
}
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  res.send("Token deleted")
}
