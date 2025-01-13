import mongoose from "mongoose"
import AutoIncrementFactory from "mongoose-sequence"

const AutoIncrement = AutoIncrementFactory(mongoose.connection)

const studentSchema = new mongoose.Schema({
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
  contactNumber: {
    type: String,
    required: true,
    trim: true,
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
    default: null,
  },
  sectionName: {
    type: String,
    default: null,
  },
  admNo: {
    type: Number,
    unique: true,
  },
  totalDaysPresent: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

studentSchema.plugin(AutoIncrement, { inc_field: "admNo" })

const Student = mongoose.model("Student", studentSchema)
export default Student
