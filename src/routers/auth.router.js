import express from "express"
import {
  login,
  register,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  profile,
} from "../controllers/auth.controller.js"
import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from "../schemas/auth.schema.js"
import verifyToken from "../middlewares/verifyToken.middleware.js"
import validationHandler from "../utils/validationHandler.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/login", upload.none(), validationHandler(loginRequest), login)

router.post(
  "/register",
  upload.single("avatar"),
  validationHandler(registerRequest),
  register
)

router.post(
  "/verifyEmail",
  upload.none(),
  validationHandler(verifyEmailRequest),
  verifyEmail
)

router.post("/logout", verifyToken, upload.none(), logout)

router.post(
  "/forgotPassword",
  upload.none(),
  validationHandler(forgotPasswordRequest),
  forgotPassword
)

router.post(
  "/resetPassword",
  upload.none(),
  validationHandler(resetPasswordRequest),
  resetPassword
)

router.get("/profile", verifyToken, upload.none(), profile)

export default router
