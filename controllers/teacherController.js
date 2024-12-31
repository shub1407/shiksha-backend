import mongoose from "mongoose"
import Teacher from "../models/Teacher.js"
//first find the assigned section & then from another api find all the student of particular section
export const viewAssignedSection = async (req, res) => {
  try {
    const { teacherId } = req.body
    const teacher = await Teacher.findById(teacherId).populate("section")
    res.status(200).json({
      error: false,
      message: "Teacher's assigned section",
      data: {
        section: teacher.section,
        subject: teacher.subject,
        assignedDays: teacher.assignedDays,
      },
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
