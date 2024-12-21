import mongoose from "mongoose"

export default async function connectDB() {
  await mongoose.connect(process.env.DB_URL).then(
    () => {
      console.log("Db connected successfully")
    },
    (error) => {
      console.log("Error occured", error)
    }
  )
}
