import express from "express"
import { getKey } from "../controllers/key.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/", upload.none(), getKey)

export default router
