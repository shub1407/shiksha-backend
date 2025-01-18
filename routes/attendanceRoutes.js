import express from "express"
import {
  markAttendance,
  addHoliday,
  viewAllHolidays,
  checkAttendance,
  checkAttendanceStatusOnDay,
  getAttendanceByClassAndSection,
  markAttendanceForTeacher,
} from "../controllers/attendanceController.js"
const router = express.Router()

router.post("/mark-attendance", markAttendance)
router.post("/mark-attendance-teacher", markAttendanceForTeacher)
router.post("/check-attendance-status", checkAttendanceStatusOnDay)
router.post("/check-attendance", checkAttendance)
router.post("/add-holiday", addHoliday)
router.get("/holiday", viewAllHolidays)
//report
router.post(
  "/report/:class/:sectionName/:month/:year",
  getAttendanceByClassAndSection
)
export default router
