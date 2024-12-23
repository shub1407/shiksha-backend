import Teacher from "../../models/Teacher.js"
import Student from "../../models/Student.js"
import Section from "../../models/Section.js"
import SectionTeacher from "../../models/SectionTeacher.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const {
      rollNo,
      name,
      email,
      password,
      contactNumber,
      class: studentClass,
      subject,
      assignedDays,
      Year,
    } = req.body

    const hashedPassword = await bcrypt.hash(password, 12)
    const existedTeacher = await Teacher.findOne({ email })
    if (existedTeacher) {
      return res
        .status(400)
        .json({ error: true, message: "Teacher already exists", data: null })
    }
    const newTeacher = new Teacher({
      rollNo,
      name,
      email,
      password: hashedPassword,
      contactNumber,
      subject,
      class: studentClass,
      assignedDays,
      Year,
    })
    await newTeacher.save()
    res.status(201).json({
      error: false,
      message: "Teacher Created successfully",
      data: newTeacher,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//View All teacher
export const viewAllTeacher = async (req, res) => {
  try {
    const teachers = await Teacher.find()
    res.status(200).json({
      error: false,
      message: "All teachers fetched successfully",
      data: teachers,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//View teachers by class
export const viewTeacherByClass = async (req, res) => {
  try {
    const { classTaught } = req.params
    const teachers = await Teacher.find({ classTaught })
    res.status(200).json({
      error: false,
      message: "Teacher fetched successfully",
      data: teachers,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//assign teacher to a section of a class
export const assignTeacherToSection = async (req, res) => {
  try {
    const { teacherId, sectionId } = req.body
    const teacher = await Teacher.findById(teacherId)
    if (!teacher) {
      return res
        .status(400)
        .json({ error: true, message: "Teacher not found", data: null })
    }
    const section = await Section.findById(sectionId)
    if (!section) {
      return res
        .status(400)
        .json({ error: true, message: "Section not found", data: null })
    }
    teacher.section = sectionId
    //saving to SectionTeacher
    await teacher.save()
    const newSectionTeacher = new SectionTeacher({
      sectionId,
      teacherId,
      scheduledDay: teacher.assignedDays,
      subject: teacher.subject,
    })
    await newSectionTeacher.save()

    res.status(200).json({
      error: false,
      message: "Teacher assigned to section successfully",
      data: newSectionTeacher,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

//STUDENT CONTROLLER

//create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, email, contactNumber, class: studentClass } = req.body
    const existedStudent = await Student.findOne({ email })
    if (existedStudent) {
      return res
        .status(400)
        .json({ error: true, message: "Student already exists", data: null })
    }
    const newStudent = new Student({
      name,
      email,
      contactNumber,
      class: studentClass,
    })

    await newStudent.save()
    res.status(201).json({
      error: false,
      message: "Student Created successfully",
      data: newStudent,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
//View All student
export const viewAllStudent = async (req, res) => {
  try {
    const students = await Student.find()
    res.status(200).json({
      error: false,
      message: "All students fetched successfully",
      data: students,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//View students by class
export const viewStudentByClass = async (req, res) => {
  try {
    const { class: studentClass } = req.params
    const { section } = req.query
    let sectionId
    let students
    console.log(section)
    //if section is provided
    if (section) {
      //if section is none that is providing students that are no assigjned
      if (section == "none") {
        students = await Student.find({
          class: studentClass,
          section: null,
        })
      } else {
        sectionId = await Section.findOne({
          class: studentClass,
          name: section,
        })

        if (sectionId) {
          students = await Student.find({
            class: studentClass,
            section: sectionId._id,
          })
        } else {
          return res.status(400).json({
            error: true,
            message: "Section not found",
            data: null,
          })
        }
      }
    }
    //if section is not provided
    else {
      students = await Student.find({
        class: studentClass,
      })
    }

    res.status(200).json({
      error: false,
      message: "Student fetched successfully",
      data: students,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

//SECTION CONTROLLER

export const createSection = async (req, res) => {
  try {
    const { class: className, name } = req.query
    //checking if section not already present
    const existedSection = await Section.findOne({ class: className, name })
    if (existedSection) {
      return res
        .status(400)
        .json({ error: true, message: "Section already exists", data: null })
    }

    // Use className and name to create a new section
    const newSection = new Section({
      class: className,
      name,
    })

    await newSection.save()
    res.status(201).json({
      error: false,
      message: "Section created successfully",
      data: newSection,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
//assign student to section
export const assignStudentsToSection = async (req, res) => {
  try {
    const { studentId, sectionId } = req.body
    const section = await Section.findById(sectionId)
    if (!section) {
      return res
        .status(400)
        .json({ error: true, message: "Section not found", data: null })
    }
    studentId.forEach(async (id) => {
      const student = await Student.findById(id)
      if (!student) {
        return res
          .status(400)
          .json({ error: true, message: "Student not found", data: null })
      }

      student.section = sectionId
      await student.save()
    })
    res.status(200).json({
      error: false,
      message: "Student assigned to section successfully",
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
