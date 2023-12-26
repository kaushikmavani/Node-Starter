import expres from "express"
import {
  changePassword,
  updateProfile,
} from "../controllers/user.controller.js"
import {
  changePasswordRequest,
  updateProfileRequest,
} from "../schemas/user.schema.js"
import verifyToken from "../middlewares/verifyToken.middleware.js"
import validationHandler from "../utils/validationHandler.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = expres.Router()

router.post(
  "/changePassword",
  verifyToken,
  upload.none(),
  validationHandler(changePasswordRequest),
  changePassword
)

router.post(
  "/updateProfile",
  verifyToken,
  upload.single("avatar"),
  validationHandler(updateProfileRequest),
  updateProfile
)

export default router
