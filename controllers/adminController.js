import Admin from "../models/Admin.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      permissions,
    })
    await newAdmin.save()
    res.status(201).json(newAdmin)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" })
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" })
    }
    const token = jwt.sign(
      { id: admin._id, role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.cookie("token", token, {
      httpOnly: true,
    })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
    res.status(200).json(admins)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
