import Admin from "../models/Admin.js"
import Moderator from "../models/Moderator.js"
import Student from "../models/Student.js"
import Teacher from "../models/Teacher.js"
import Attendance from "../models/Attendance.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const existedAdmin = await Admin.findOne({ email })
    if (existedAdmin) {
      return res
        .status(400)
        .json({ error: true, message: "Admin already exists", data: null })
    }
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      contactNumber,
    })
    await newAdmin.save()
    res.status(201).json({
      error: false,
      message: "Admin Created successfully",
      data: newAdmin,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(404).json({ error: true, message: "Admin not found" })
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: true, message: "Invalid password" })
    }
    const token = jwt.sign(
      { id: admin._id, role: "admin", email },
      process.env.JWT_SECRET
    )
    res.cookie("token", token, {
      httpOnly: true,
    })
    res
      .status(200)
      .json({ error: false, message: "Loged in successfully", data: { token } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
    res.status(200).json({
      error: false,
      message: "Admin fetched successfully",
      data: { admins },
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

//create moderator
//TODO: get the admin id from the token
export const createModerator = async (req, res) => {
  try {
    const { name, email, password, contactNumber, managedSections, createdBy } =
      req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    const newModerator = new Moderator({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      managedSections,
      createdBy,
    })
    await newModerator.save()
    res.status(201).json({
      error: false,
      message: "Moderator Created successfully",
      data: newModerator,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//get all moderators
export const getAllModerators = async (req, res) => {
  try {
    const moderators = await Moderator.find()
    res.status(200).json({
      error: false,
      message: "Moderators fetched successfully",
      data: { moderators },
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//dashboard statd
export const dashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments()
    const totalTeachers = await Teacher.countDocuments()
    const presentToday = await Attendance.countDocuments({
      date: new Date(),
      status: "present",
    })
    const absentToday = await Attendance.countDocuments({
      date: new Date(),
      status: "absent",
    })

    res.json({
      error: false,
      message: "dashboard stats fetched successfully",
      data: { totalStudents, totalTeachers, presentToday, absentToday },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    res.status(500).send("Server Error")
  }
}
