import express from "express"
import {
  createAdmin,
  getAllAdmins,
  loginAdmin,
  createModerator,
  getAllModerators,
  dashboardStats,
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
  viewClassBySection,
  viewClassBySectionInDetail,
  viewAllClasses,
} from "../controllers/shared/userController.js"

const router = express.Router()

router.post("/signup", createAdmin)
router.get("/", getAllAdmins)
router.post("/login", loginAdmin)
//dashboard
router.get("/dashboard-stats", dashboardStats)
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

//class

router.get("/class/:class", viewClassBySection)
router.get("/class-detail/:sectionId", viewClassBySectionInDetail)

//all classes

router.get("/all-classes", viewAllClasses)

//class

// createAdmin,

export default router
