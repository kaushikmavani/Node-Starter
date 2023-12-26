import mongoose, { Schema } from "mongoose"
import path from "path"
import config from "../config/app.config.js"

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      email: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Number,
      default: 0,
    },
    token: String,
    avatar: {
      type: String,
      get: (v) => {
        return v ? path.join(config.app.appURL, "images", "avatars", v) : null
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      getters: true,
    },
    toJSON: {
      getters: true,
    },
    id: false,
  }
)

const User = mongoose.model("User", userSchema)

export default User
