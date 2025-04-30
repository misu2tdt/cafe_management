import express from "express"
import { test, getAllUsers} from "../controllers/userController.js"
const router = express.Router()


router.get("/", test)
router.get("/", getAllUsers)

export default router