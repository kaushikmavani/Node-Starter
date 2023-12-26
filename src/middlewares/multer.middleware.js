import multer from "multer"
import path from "path"
import fs from "fs"

const filename = (file) => {
  return Date.now() + path.extname(file.originalname)
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == "avatar") {
        if (!fs.existsSync(path.join("public", "images", "avatars"))) {
          fs.mkdirSync(path.join("public", "images", "avatars"))
        }

        cb(null, path.join("public", "images", "avatars"))
      }
    },
    filename: function (req, file, cb) {
      cb(null, filename(file))
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname == "avatar") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        const err = new Error(
          "Please select only .png, .jpg and .jpeg image format in the avatar field."
        )
        err.status = 422
        return cb(err)
      }
    } else {
      cb(null, true)
    }
  },
})
