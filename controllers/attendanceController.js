import Attendance from "../models/Attendance.js"
import Leave from "../models/Leave.js"
import Holiday from "../models/Holiday.js"
import Student from "../models/Student.js"
import Teacher from "../models/Teacher.js"
import Moderator from "../models/Moderator.js"
import Admin from "../models/Admin.js"
export const markAttendance = async (req, res) => {
  const { userId, userType, date, status, markedById, markedByRole } = req.body

  try {
    const checkDate = new Date(date)
    // Check if the date is a holiday (non-recurring or recurring)
    const isHoliday = await Holiday.findOne({
      $or: [
        { startDate: { $lte: checkDate }, endDate: { $gte: checkDate } }, // Check for non-recurring holidays
        {
          isRecurring: true,
          startDate: { $lte: new Date(checkDate).setFullYear(2000) },
          endDate: { $gte: new Date(checkDate).setFullYear(2000) },
        }, // Check for recurring holidays
      ],
    })

    if (isHoliday) {
      return res.status(400).json({
        error: true,
        message: `Cannot mark attendance. ${isHoliday.description} is a holiday.`,
      })
    }
    // Convert the provided date to a JavaScript Date object

    // Check if the date is a Sunday
    if (checkDate.getDay() === 0) {
      // 0 represents Sunday
      return res.status(400).json({
        error: true,
        message: "Cannot mark attendance. Sunday is a holiday.",
      })
    }

    // Mark attendance
    const attendance = new Attendance({
      userId,
      userType,
      date: checkDate,
      status,
      markedById,
      markedByRole,
    })

    await attendance.save()

    res.status(201).json({
      error: false,
      message: "Attendance marked successfully.",
      data: attendance,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
//check attendance
export const checkAttendance = async (req, res) => {
  const { userId, userType, startDate, endDate } = req.body

  try {
    // Validate input
    if (!userId || !userType) {
      return res.status(400).json({
        error: true,
        message: "userId and userType are required.",
      })
    }

    // Parse startDate and endDate
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Ensure the end date is after the start date
    if (end < start) {
      return res.status(400).json({
        error: true,
        message: "End date must be after start date.",
      })
    }
    let user
    if (userType === "student") {
      user = await Student.findById(userId)
    }
    if (userType === "teacher") {
      user = await Teacher.findById(userId)
    }
    if (userType === "moderator") {
      user = await Moderator.findById(userId)
    }
    if (userType === "admin") {
      user = await Admin.findById(userId)
    }

    // Build the query for attendance
    const attendanceQuery = {
      userId,
      userType,
      date: { $gte: start, $lte: end }, // Filter attendance by the date range
    }

    // Build the query for holidays
    const holidayQuery = {
      startDate: { $lte: end },
      endDate: { $gte: start },
    }

    // Fetch attendance and holidays in parallel
    const [attendanceRecords, holidays] = await Promise.all([
      Attendance.find(attendanceQuery).sort({ date: 1 }),
      Holiday.find(holidayQuery).sort({ startDate: 1 }),
    ])

    // Create a set of all dates in the range [startDate, endDate]
    const allDates = new Set()
    let currentDate = new Date(start)

    while (currentDate <= end) {
      allDates.add(currentDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Now create the result array
    const result = []

    // Iterate over all the dates in the range
    allDates.forEach((date) => {
      const attendance = attendanceRecords.find(
        (record) => record.date.toISOString().split("T")[0] === date
      )
      const holiday = holidays.find((holiday) => {
        const holidayStart = new Date(holiday.startDate)
          .toISOString()
          .split("T")[0]
        const holidayEnd = new Date(holiday.endDate).toISOString().split("T")[0]
        return date >= holidayStart && date <= holidayEnd
      })

      // Check if it's a Sunday
      const isSunday = new Date(date).getDay() === 0 // 0 represents Sunday

      if (isSunday) {
        result.push({
          date,
          status: "Holiday",
          description: "Sunday Holiday",
        })
      } else if (holiday) {
        result.push({
          date,
          status: "Holiday",
          description: holiday.description,
        })
      } else if (attendance) {
        result.push({
          date,
          status: attendance.status,
        })
      } else {
        result.push({
          date,
          status: "Not Found",
        })
      }
    })

    res.status(200).json({
      error: false,
      message: "Attendance and holiday records retrieved successfully.",
      data: { user, attendanceRecord: result },
    })
  } catch (error) {
    console.error("Error checking attendance and holidays:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
//add holiday
export const addHoliday = async (req, res) => {
  try {
    const { startDate, endDate, description } = req.body

    // Validate input
    if (!startDate || !endDate || !description) {
      return res.status(400).json({
        message: "All fields (startDate, endDate, description) are required.",
      })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      return res
        .status(400)
        .json({ message: "startDate cannot be after endDate." })
    }

    // Check for overlapping holidays
    const overlappingHoliday = await Holiday.findOne({
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }, // Check if dates overlap
      ],
    })

    if (overlappingHoliday) {
      return res.status(409).json({
        error: true,
        message: `Holiday overlaps with an existing holiday: ${
          overlappingHoliday.description
        } from ${new Date(overlappingHoliday.startDate)
          .toISOString()
          .slice(0, 10)} to ${new Date(overlappingHoliday.endDate)
          .toISOString()
          .slice(0, 10)}.`,
      })
    }

    // Create and save new holiday
    const newHoliday = new Holiday({
      startDate: start,
      endDate: end,
      description,
    })

    await newHoliday.save()

    res.status(201).json({
      error: false,
      message: "Holiday added successfully.",
      holiday: newHoliday,
    })
  } catch (error) {
    console.error("Error adding holiday:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
