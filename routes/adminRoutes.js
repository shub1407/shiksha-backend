import express from "express"
import {
  createAdmin,
  getAllAdmins,
  loginAdmin,
} from "../controllers/adminController.js"

const router = express.Router()

router.post("/", createAdmin)
router.get("/", getAllAdmins)
router.post("/login", loginAdmin)

export default router
