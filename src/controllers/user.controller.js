import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"
import { errorResponse, successResponse } from "../utils/responseHandler.js"
import User from "../models/User.js"
import config from "../config/app.config.js"

export const changePassword = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    if (req.body.oldPassword == req.body.newPassword) {
      return await errorResponse(
        res,
        422,
        0,
        config.messages.oldPasswordAndNewPasswordSame
      )
    }

    if (!bcrypt.compareSync(req.body.oldPassword, req.user.password)) {
      return await errorResponse(
        res,
        422,
        0,
        config.messages.invalidOldPassword
      )
    }

    const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength)
    const hashPassword = bcrypt.hashSync(req.body.newPassword, salt)

    await User.updateOne(
      { _id: req.user._id },
      { password: hashPassword },
      { session }
    )

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.changePasswordSuccessful
    )
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const updateProfile = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    let user = await User.findOne({ _id: req.user._id })

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }

    if (req.file) {
      data.avatar = req.file.filename

      if (user.avatar) {
        fs.unlink(
          path.join(
            "public",
            "images",
            "avatars",
            user.toObject({ getters: false }).avatar
          ),
          (err) => {
            if (err) {
              console.log("There is not already exist this user's avatar.")
            }
          }
        )
      }
    }

    await User.updateOne({ _id: req.user._id }, data, { session })

    user = await User.findOne({ _id: req.user._id }).session(session)

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.updateProfileSuccessful,
      user
    )
  } catch (error) {
    await session.abortTransaction()
    if (req.file) {
      fs.unlink(
        path.join("public", "images", "avatars", req.file.filename),
        (err) => {
          if (err) {
            console.log("There is not already exist this logo.")
          }
        }
      )
    }
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}
