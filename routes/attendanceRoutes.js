import express from "express"
import {
  markAttendance,
  addHoliday,
  viewAllHolidays,
  checkAttendance,
  checkAttendanceStatusOnDay,
  getAttendanceByClassAndSection,
} from "../controllers/attendanceController.js"
const router = express.Router()

router.post("/mark-attendance", markAttendance)
router.post("/check-attendance-status", checkAttendanceStatusOnDay)
router.post("/check-attendance", checkAttendance)
router.post("/add-holiday", addHoliday)
router.get("/holiday", viewAllHolidays)
//report
router.get(
  "/report/:class/:sectionName/:month/:year",
  getAttendanceByClassAndSection
)
export default router
