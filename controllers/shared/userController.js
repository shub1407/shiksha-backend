import Teacher from "../../models/Teacher.js"
import Student from "../../models/Student.js"
import Section from "../../models/Section.js"
import SectionTeacher from "../../models/SectionTeacher.js"
import Class from "../../models/Class.js"
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
      year,
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
      year,
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
    const teachers = await Teacher.find().sort({ class: 1, sectionName: 1 })
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
    const { class: studentClass } = req.params
    let { section, day } = req.query
    //CASE 1: all section & all day-->all available teacher of particular class
    if (section == "all" && day == "all") {
      const teachers = await Teacher.find({
        class: studentClass,
      })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
    //CASE2: all unassigned teacher of a class
    if (section == "none" && day == "all") {
      const teachers = await Teacher.find({
        class: studentClass,
        section: null,
      })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
    //CASE3: all unassigned teacher of a class on particular day
    if (section == "none" && day != "all") {
      const teachers = await Teacher.find({
        class: studentClass,
        section: null,
        assignedDays: day,
      })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
    //CASE4:all teacher of a particular section
    if (day == "all" && section != "all") {
      const sectionId = await Section.findOne({
        class: studentClass,
        name: section,
      })
      if (!sectionId) {
        return res.status(400).json({
          error: true,
          message: "Section not found",
          data: null,
        })
      }
      const teachers = await Teacher.find({
        class: studentClass,
        section: sectionId._id,
      })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
    //CASE5: all teacher of a particular day
    if (section == "all" && day != "all") {
      const teachers = await Teacher.find({
        class: studentClass,
        assignedDays: day,
      }).sort({ sectionName: 1 })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
    //CASE6: teacher of a particular section on a particular day
    if (day != "all" && section != "all") {
      const sectionId = await Section.findOne({
        class: studentClass,
        name: section,
      })
      if (!sectionId) {
        return res.status(400).json({
          error: true,
          message: "Section not found",
          data: null,
        })
      }
      const teachers = await Teacher.find({
        class: studentClass,
        section: sectionId._id,
        assignedDays: day,
      })
      return res.status(200).json({
        error: false,
        message: "Teacher fetched successfully",
        data: teachers,
      })
    }
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
    teacher.sectionName = section.name
    section.teachers.push(teacherId)
    await section.save()
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
    //add class to class modell if not exist
    const studentClassModel = await Class.findOne({ name: studentClass })
    if (!studentClassModel) {
      const newClass = new Class({
        name: studentClass,
      })
      await newClass.save()
    }
    //create new student with class
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
    // const students = await Student.find().sort({
    //   class: 1,
    //   sectionName: 1,
    //   admNo: 1,
    // })
    const students = await Student.aggregate([
      {
        $addFields: {
          numericName: { $toDouble: "$class" },
        },
      },
      {
        $sort: { numericName: 1, sectionName: 1, admNo: 1 },
      },
    ])
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
        }).sort({ sectionName: 1 })
      } else {
        sectionId = await Section.findOne({
          class: studentClass,
          name: section,
        })

        if (sectionId) {
          students = await Student.find({
            class: studentClass,
            section: sectionId._id,
          }).sort({ sectionName: 1 })
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
      }).sort({ sectionName: 1 })
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

    //add to class schema
    let existedClass = await Class.findOne({ name: className })
    console.log(existedClass)
    if (!existedClass) {
      const newClass = new Class({
        name: className,
        sections: [name],
      })
      newClass.save()
    } else {
      existedClass.sections.push(name)
      existedClass.save()
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
      student.class = section.class
      student.section = sectionId
      student.sectionName = section.name
      await student.save()
    })
    section.students.push(...studentId)
    await section.save()
    res.status(200).json({
      error: false,
      message: "Student assigned to section successfully",
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

//view teacher assignment to section
export const viewTeacherAssignmentToSection = async (req, res) => {
  try {
    const { class: studentClass } = req.params

    // Check if the class exists
    const existedClass = await Class.findOne({ name: studentClass })
    if (!existedClass) {
      return res
        .status(400)
        .json({ error: true, message: "Class not found", data: null })
    }

    const sections = existedClass.sections
    const sectionTeachers = []

    // Use for...of loop for asynchronous operations
    for (const section of sections) {
      const obj = {
        section,
        0: [],
        1: [],
      }

      const sectionId = await Section.findOne({
        class: studentClass,
        name: section,
      })
      obj.sectionId = sectionId._id

      if (sectionId) {
        const teachers = await SectionTeacher.find({ sectionId: sectionId._id })

        teachers.forEach((teacher) => {
          obj[teacher.scheduledDay].push({
            teacherId: teacher._id,
            subject: teacher.subject,
          })
        })
      }

      sectionTeachers.push(obj)
    }

    res.status(200).json({
      error: false,
      message: "Teacher assignment to section fetched successfully",
      data: { class: studentClass, sectionTeachers },
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

//view class by section

export const viewClassBySection = async (req, res) => {
  const { class: studentClass } = req.params
  try {
    const data = await Section.find({ class: studentClass })
    res.status(200).json({
      error: false,
      message: "Class fetched successfully",
      data: data,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}

export const viewClassBySectionInDetail = async (req, res) => {
  const { sectionId } = req.params
  console.log(sectionId)
  try {
    const data = await Section.findById(sectionId).populate([
      "teachers",
      "students",
    ])

    res.status(200).json({
      error: false,
      message: "Class fetched successfully",
      data: data,
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
export const viewAllClasses = async (req, res) => {
  try {
    const data = await Class.aggregate([
      {
        $addFields: {
          numericName: { $toDouble: "$name" },
        },
      },
      {
        $sort: { numericName: 1 },
      },
    ])
    //return class:[section as data]
    let obj = {}
    let classes = []
    data.forEach((item) => {
      obj[item.name] = item.sections
      classes.push(item.name)
    })
    res.status(200).json({
      error: false,
      message: "All classes fetched successfully",
      data: { sections: obj, classes: classes },
    })
  } catch (error) {
    res.status(500).json({ error: true, message: error.message, data: null })
  }
}
