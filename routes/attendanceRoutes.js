import express from "express"
import {
  markAttendance,
  addHoliday,
  checkAttendance,
} from "../controllers/attendanceController.js"
const router = express.Router()

router.post("/mark-attendance", markAttendance)
router.post("/check-attendance", checkAttendance)
router.post("/add-holiday", addHoliday)
export default router
