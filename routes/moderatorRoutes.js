import express from "express"
import {
  createModerator,
  getAllModerators,
  loginModerator,
} from "../controllers/moderatorController.js"
import {
  createTeacher,
  viewAllTeacher,
  viewTeacherByClass,
  createStudent,
  viewAllStudent,
  viewStudentByClass,
} from "../controllers/shared/userController.js"

const router = express.Router()

router.post("/login", loginModerator)

//teacher
router.post("/create-teacher", createTeacher)
router.get("/teachers", viewAllTeacher)
router.get("/teachers/:classTaught", viewTeacherByClass)

//student
router.post("/create-student", createStudent)
router.get("/students", viewAllStudent)
router.get("/students/:class", viewStudentByClass)

export default router
