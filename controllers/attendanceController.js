import Attendance from "../models/Attendance.js"
import Leave from "../models/Leave.js"
import Holiday from "../models/Holiday.js"
import Student from "../models/Student.js"
import Teacher from "../models/Teacher.js"
import Moderator from "../models/Moderator.js"
import Admin from "../models/Admin.js"
//mark attendance
export const markAttendance = async (req, res) => {
  const {
    attendanceData,
    classInput,
    sectionInput,
    attendanceDate,
    markedById,
    markedByRole,
    userType,
  } = req.body

  try {
    const checkDate = new Date(attendanceDate)

    // Check if the date is a holiday (non-recurring or recurring)
    const isHoliday = await Holiday.findOne({
      $or: [
        { startDate: { $lte: checkDate }, endDate: { $gte: checkDate } }, // Non-recurring holidays
        {
          isRecurring: true,
          startDate: { $lte: new Date(checkDate).setFullYear(2000) },
          endDate: { $gte: new Date(checkDate).setFullYear(2000) },
        }, // Recurring holidays
      ],
    })

    if (isHoliday) {
      return res.status(400).json({
        error: true,
        message: `Cannot mark attendance. ${isHoliday.description} is a holiday.`,
      })
    }

    // Check if the date is a Sunday
    if (checkDate.getDay() === 0) {
      return res.status(400).json({
        error: true,
        message: "Cannot mark attendance. Sunday is a holiday.",
      })
    }
    //check if the attendance is not marked on that day

    // Prepare attendance records
    const attendanceRecords = attendanceData.map((student) => ({
      userId: student.id,
      userType: "student",
      class: classInput,
      sectionName: sectionInput,
      date: checkDate,
      status: student.status,
      markedById,
      markedByRole,
    }))

    // Convert attendance records into bulkWrite operations
    const bulkOperations = attendanceRecords.map((record) => ({
      updateOne: {
        filter: {
          userId: record.userId,
          date: record.date, // Ensure uniqueness based on userId and date
          class: record.class,
          sectionName: record.sectionName,
        },
        update: { $set: record }, // Update existing record with new data
        upsert: true, // Insert if no matching document is found
      },
    }))

    // Perform bulkWrite operation
    await Attendance.bulkWrite(bulkOperations)
    //update total present days
    const prsesentStudent = attendanceData.filter((student) => {
      if (student.status === "present") return student.id
    })
    console.log("present student iid")
    console.log(prsesentStudent)
    await Student.updateMany(
      {
        _id: {
          $in: prsesentStudent.map((student) => student.id),
        },
      },
      {
        $inc: { totalDaysPresent: 1 },
      }
    )

    res.status(201).json({
      error: false,
      message: "Attendance marked successfully for all students.",
      data: attendanceRecords,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
export const markAttendanceForTeacher = async (req, res) => {
  const { attendanceData, attendanceDate, markedById, markedByRole } = req.body

  try {
    const checkDate = new Date(attendanceDate)

    // Check if the date is a holiday (non-recurring or recurring)
    const isHoliday = await Holiday.findOne({
      $or: [
        { startDate: { $lte: checkDate }, endDate: { $gte: checkDate } }, // Non-recurring holidays
        {
          isRecurring: true,
          startDate: { $lte: new Date(checkDate).setFullYear(2000) },
          endDate: { $gte: new Date(checkDate).setFullYear(2000) },
        }, // Recurring holidays
      ],
    })

    if (isHoliday) {
      return res.status(400).json({
        error: true,
        message: `Cannot mark attendance. ${isHoliday.description} is a holiday.`,
      })
    }

    // Check if the date is a Sunday
    if (checkDate.getDay() === 0) {
      return res.status(400).json({
        error: true,
        message: "Cannot mark attendance. Sunday is a holiday.",
      })
    }
    //check if the attendance is not marked on that day

    // Prepare attendance records
    const attendanceRecords = attendanceData.map((teacher) => ({
      userId: teacher.id,
      userType: "teacher",
      class: teacher.class,
      sectionName: teacher.sectionName,
      date: checkDate,
      status: teacher.status,
      markedById,
      markedByRole,
    }))

    // Convert attendance records into bulkWrite operations
    const bulkOperations = attendanceRecords.map((record) => ({
      updateOne: {
        filter: {
          userId: record.userId,
          date: record.date, // Ensure uniqueness based on userId and date
          class: record.class,
          sectionName: record.sectionName,
        },
        update: { $set: record }, // Update existing record with new data
        upsert: true, // Insert if no matching document is found
      },
    }))

    // Perform bulkWrite operation
    await Attendance.bulkWrite(bulkOperations)
    //update total present days
    const prsesentTeacher = attendanceData.filter((student) => {
      if (student.status === "present") return student.id
    })
    console.log("present student iid")
    console.log(prsesentTeacher)
    await Teacher.updateMany(
      {
        _id: {
          $in: prsesentTeacher.map((teacher) => teacher.id),
        },
      },
      {
        $inc: { totalDaysPresent: 1 },
      }
    )

    res.status(201).json({
      error: false,
      message: "Attendance marked successfully for all teachers.",
      data: attendanceRecords,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
//checking if attendance is already marked of particular section of particular class on particular data
export const checkAttendanceStatusOnDay = async (req, res) => {
  const { classInput, sectionInput, attendanceDate, userType } = req.body
  try {
    const userModel = userType === "student" ? Student : Teacher
    const checkDate = new Date(attendanceDate)
    let existingAttendance
    if (userType === "student") {
      existingAttendance = await Attendance.find({
        userType,
        class: classInput,
        sectionName: sectionInput,
        date: checkDate,
      })
        .populate({
          path: "userId", // Field to populate
          model: Student, // Model to use for population
        })
        .sort({ admNo: 1 })
    }
    console.log(existingAttendance)
    if (userType === "teacher") {
      existingAttendance = await Attendance.find({
        userType,
        date: checkDate,
        class: classInput,
      })
        .populate({
          path: "userId", // Field to populate
          model: userModel, // Model to use for population
        })
        .sort({ class: 1 })
    }

    if (existingAttendance.length > 0) {
      // If attendance is marked, populate the user details with the attendance record
      const markedById = existingAttendance[0].markedById
      const markedByRole = existingAttendance[0].markedByRole
      const markedByModel =
        markedByRole === "admin"
          ? Admin
          : markedByRole === "moderator"
          ? Moderator
          : Teacher
      let markedByUser = await markedByModel.findById(markedById).lean()
      markedByUser["role"] = markedByRole
      return res.status(200).json({
        error: false,
        message: "Attendance is already marked for this day",
        data: { markedByUser, attendanceData: existingAttendance },
      })
    }
    return res.status(200).json({
      error: false,
      message: "Attendance is not marked for this day ",
      data: null,
    })
  } catch (error) {
    console.error("Error occured:")
    console.error(error)
    return res
      .status(400)
      .json({ error: true, message: "Invalid date format." })
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
//view all holiday

export const viewAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ startDate: 1 }).lean()

    res.status(200).json({
      error: false,
      message: "All holidays retrieved successfully.",
      holidays,
    })
  } catch (error) {
    console.error("Error retrieving all holidays:", error)
    res.status(500).json({ error: true, message: "Internal server error." })
  }
}
//attendance report
export const getAttendanceByClassAndSection = async (req, res) => {
  try {
    const { class: className, sectionName, month, year } = req.params
    const { userType } = req.body

    // Validate input
    if (!className || !sectionName || !month || !year) {
      return res.status(400).json({
        error: true,
        message:
          "Missing required parameters: class, sectionName, month, or year.",
      })
    }

    // Convert month and year to a date range
    const startDate = new Date(year, month - 1, 1) // Start of the month
    const endDate = new Date(year, month, 0) // End of the month
    let users
    if (userType === "student") {
      users = await Student.find({
        class: className,
        sectionName,
      }).lean()
    }
    if (userType === "teacher") {
      users = await Teacher.find({
        class: className,
      })
        .sort({ sectionName: 1, dayPref: 1 })
        .lean()
    }

    if (users.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No students found in the specified class and section.",
      })
    }

    // Fetch attendance records for these students within the given date range
    const attendanceRecords = await Attendance.find({
      class: className,
      sectionName,
      date: { $gte: startDate, $lte: endDate },
    })

    // Organize attendance data by student
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      const userId = record.userId.toString()
      if (!acc[userId]) {
        acc[userId] = []
      }
      acc[userId].push({
        date: record.date,
        status: record.status,
      })
      return acc
    }, {})

    // Prepare the final result
    const result = users.map((user) => ({
      _id: user._id,
      name: user.name,
      admNo: user.admNo,
      rollNo: user.rollNo,
      dayPref: user.assignedDays,
      class: user.class,
      sectionName: user.sectionName,
      attendance: attendanceMap[user._id.toString()] || [], // Default to empty array if no records
    }))

    // Respond with the data
    return res.status(200).json({
      error: false,
      message: "Attendance data fetched successfully.",
      data: result,
    })
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching attendance data.",
    })
  }
}
