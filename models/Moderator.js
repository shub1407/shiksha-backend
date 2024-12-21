import mongoose from "mongoose"

const moderatorSchema = new mongoose.Schema({
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
  managedSections: {
    type: [String], // E.g., ['comments', 'posts']
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Moderator = mongoose.model("Moderator", moderatorSchema)
export default Moderator
