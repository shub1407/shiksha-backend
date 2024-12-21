import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, favoriteItems } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      favoriteItems,
    })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" })
    }
    const token = jwt.sign(
      { id: user._id, role: "user", email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.cookie("token", token, { httpOnly: true })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
