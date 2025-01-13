import mongoose from "mongoose"

const teacherSchema = new mongoose.Schema({
  rollNo: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
    trim: true,
    enum: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), // ["1", "2", ..., "12"]
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    defaullt: null,
  },
  sectionName: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    enum: ["Maths", "Science"],
  },
  assignedDays: {
    type: String, // E.g., ['Monday', 'Tuesday', 'Wednesday']
    enum: ["0", "1"],
  },
  totalDaysPresent: {
    type: Number,
    default: 0,
  },
  year: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Teacher = mongoose.model("Teacher", teacherSchema)
export default Teacher
