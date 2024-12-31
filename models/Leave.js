import mongoose from "mongoose"
const LeaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userType: {
    type: String,
    enum: ["teacher", "moderator", "student"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["sick", "casual", "other"],
    required: true,
  },
  reason: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedById: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  approvedByRole: {
    type: String,
    enum: ["teacher", "moderator", "admin"],
    default: null,
  },
  approvedAt: {
    type: Date,
    default: null,
  },
})

const Leave = mongoose.model("Leave", LeaveSchema)

export default Leave
