import express from "express"
import {
  createModerator,
  getAllModerators,
  loginModerator,
} from "../controllers/moderatorController.js"

const router = express.Router()

router.post("/", createModerator)
router.get("/", getAllModerators)
router.post("/login", loginModerator)

export default router
