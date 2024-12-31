import { login, authStatus, logout } from "../controllers/loginController.js"
import express from "express"
const router = express.Router()
router.post("/login", login)
router.get("/logout", logout)
router.get("/auth-status", authStatus)
export default router
