import express from "express"
import { getVersions } from "../controllers/version.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/", upload.none(), getVersions)

export default router
