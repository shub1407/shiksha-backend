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
  viewTeacherAssignmentToSection,
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
router.get("/view-teachers", viewAllTeacher)
router.get("/view-teachers/:class", viewTeacherByClass)
router.post("/assign-teacher", assignTeacherToSection)

//student
router.post("/create-student", createStudent)
router.get("/students", viewAllStudent)
router.get("/students/:class", viewStudentByClass)
router.post("/create-section", createSection)
router.post("/assign-students", assignStudentsToSection)

//section
router.get(
  "/section/view-teacher-assignment/:class",
  viewTeacherAssignmentToSection
)

export default router
