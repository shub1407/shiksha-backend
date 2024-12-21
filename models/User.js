import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
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
  favoriteItems: {
    type: [String], // E.g., IDs of favorite products or posts
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", userSchema)
export default User
