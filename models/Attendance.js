import mongoose from "mongoose"

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userType: {
    type: String,
    enum: ["teacher", "moderator", "student"], // Indicates which table/collection the userId belongs to
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["present", "absent", "on_leave"],
    required: true,
  },
  markedById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  markedByRole: {
    type: String,
    enum: ["teacher", "moderator", "admin"], // Indicates which table/collection the markedById belongs to
    required: true,
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
})

const Attendance = mongoose.model("Attendance", AttendanceSchema)

export default Attendance
