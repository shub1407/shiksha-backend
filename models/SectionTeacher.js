import mongoose from "mongoose"
const sectionTeacherSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  scheduledDay: {
    type: String,
    required: true,
    enum: ["0", "1"],
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    enum: ["Maths", "Science"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
const SectionTeacher = mongoose.model("SectionTeacher", sectionTeacherSchema)
export default SectionTeacher
