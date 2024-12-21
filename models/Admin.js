import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
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
  permissions: {
    type: [String], // E.g., ['manage-users', 'view-reports']
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Admin = mongoose.model("Admin", adminSchema)
export default Admin
