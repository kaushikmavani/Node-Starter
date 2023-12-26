import express from "express"
import verifyKey from "../middlewares/verifyKey.middleware.js"
import authRouter from "./auth.router.js"
import versionRouter from "./version.router.js"
import keyRouter from "./key.router.js"
import userRouter from "./user.router.js"

const router = express.Router()

router.use("/auth", verifyKey, authRouter)
router.use("/versions", verifyKey, versionRouter)
router.use("/key", keyRouter)
router.use("/user", verifyKey, userRouter)

export default router
