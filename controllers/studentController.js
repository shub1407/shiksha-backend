import Student from "../models/Student.js"

// ...existing code...

const createStudent = async (req, res) => {
  try {
    const { name, email, contactNumber, class: studentClass } = req.body

    const newStudent = new Student({
      name,
      email,
      contactNumber,
      class: studentClass,
    })

    await newStudent.save()
    res.status(201).json(newStudent)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ...existing code...

export { createStudent }
