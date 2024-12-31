import mongoose from "mongoose"

const HolidaySchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
    unique: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
HolidaySchema.virtual("duration").get(function () {
  const timeDifference =
    new Date(this.endDate).getTime() - new Date(this.startDate).getTime()
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1 // Add 1 to include both start and end dates
})

const Holiday = mongoose.model("Holiday", HolidaySchema)
export default Holiday
