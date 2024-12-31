import mongoose from "mongoose"
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    enum: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  },
  sections: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Class = mongoose.model("Class", classSchema)
export default Class
