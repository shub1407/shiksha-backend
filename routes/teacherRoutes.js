import express from "express"
import { viewAssignedSection } from "../controllers/teacherController.js"
const router = express.Router()

router.get("/view-assigned-section", viewAssignedSection)

export default router
