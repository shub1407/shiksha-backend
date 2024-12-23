import express from "express"
import {
  createAdmin,
  getAllAdmins,
  loginAdmin,
  createModerator,
  getAllModerators,
} from "../controllers/adminController.js"

import {
  createTeacher,
  viewAllTeacher,
  viewTeacherByClass,
  createStudent,
  viewAllStudent,
  viewStudentByClass,
  createSection,
  assignStudentsToSection,
  assignTeacherToSection,
} from "../controllers/shared/userController.js"

const router = express.Router()

router.post("/signup", createAdmin)
router.get("/", getAllAdmins)
router.post("/login", loginAdmin)

//moderator
router.post("/create-moderator", createModerator)
router.get("/moderators", getAllModerators)

//teacher
router.post("/create-teacher", createTeacher)
router.get("/teachers", viewAllTeacher)
router.get("/teachers/:classTaught", viewTeacherByClass)

//student
router.post("/create-student", createStudent)
router.get("/students", viewAllStudent)
router.get("/students/:class", viewStudentByClass)
//class
//create section
router.post("/create-section", createSection)
//assign students to section
router.post("/assign-students", assignStudentsToSection)
//assign teacher to section
router.post("/assign-teacher", assignTeacherToSection)
export default router
