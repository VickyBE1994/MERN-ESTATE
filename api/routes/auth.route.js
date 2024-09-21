import express from "express"
import { signin, Signup,googleAuth,signOut } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup",Signup)
router.post("/signin",signin)
router.post("/google",googleAuth)
router.get('/signout',signOut)

export default router