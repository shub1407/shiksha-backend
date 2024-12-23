import mongoose from "mongoose"

const sectionSchema = new mongoose.Schema({
  name: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
const Section = mongoose.model("Section", sectionSchema)
export default Section
