import { hash } from "bcrypt"
import Moderator from "../models/Moderator.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
// Create a new moderator
export const createModerator = async (req, res) => {
  try {
    const { name, email, password, managedSections } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newModerator = new Moderator({
      name,
      email,
      password: hashedPassword,
      managedSections,
    })
    await newModerator.save()
    res.status(201).json(newModerator)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Login moderator
export const loginModerator = async (req, res) => {
  try {
    const { email, password } = req.body
    const moderator = await Moderator.findOne({ email })
    if (!moderator) {
      return res.status(404).json({ error: "Moderator not found" })
    }
    const isPasswordValid = await bcrypt.compare(password, moderator.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" })
    }
    const token = jwt.sign(
      { id: moderator._id, role: "moderator", email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
    res.cookie("token", token, { httpOnly: true })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all moderators
export const getAllModerators = async (req, res) => {
  try {
    const moderators = await Moderator.find()
    res.status(200).json(moderators)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
