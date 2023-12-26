import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"
import ejs from "ejs"
import fs from "fs"
import path from "path"
import config from "../config/app.config.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"
import { createTransport } from "../utils/nodeMailer.js"
import User from "../models/User.js"
import Token from "../models/Token.js"

export const login = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return await errorResponse(
        res,
        400,
        0,
        config.messages.emailNotRegistered
      )
    }

    if (!user.emailVerified) {
      return await errorResponse(res, 400, 0, config.messages.emailNotVerified)
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return await errorResponse(res, 400, 0, config.messages.invalidPassword)
    }

    const token = jwt.sign(
      { key: req.key, userId: user._id },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    )

    const response = {
      token,
      user,
    }

    // Remove user's expired token
    const userToken = await Token.find({ userId: user._id }).select("_id token")
    if (userToken.length) {
      const deletableTokens = userToken.filter((singleToken) => {
        try {
          const decoded = jwt.verify(singleToken.token, config.auth.jwtSecret)
          if (decoded.exp < parseInt(Date.now() / 1000)) {
            return true
          }
        } catch (error) {
          return true
        }
        return false
      })
      if (deletableTokens.length) {
        await Token.deleteMany(
          { _id: deletableTokens.map((singleToken) => singleToken._id) },
          { session }
        )
      }
    }

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.loginSuccessful,
      response
    )
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const register = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
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
      return await errorResponse(
        res,
        400,
        0,
        config.messages.emailAlreadyRegistered
      )
    }

    const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength)
    const hashPassword = bcrypt.hashSync(req.body.password, salt)

    const token = crypto.randomBytes(32).toString("hex")

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
      token,
    }
    if (req.file) data.avatar = req.file.filename

    await User.create([data], { session })

    const mailer = await createTransport()

    const mailData = {
      name: `${req.body.firstName} ${req.body.lastName}`,
      link: `${req.headers.host}/auth/verifyEmail/${token}`,
    }

    const str = await ejs.renderFile(
      "src/views/emails/confirmation.ejs",
      mailData,
      {
        async: true,
      }
    )
    const mailOptions = {
      from: "Starter <starter@starter.com>",
      to: req.body.email,
      subject: "Confirmation Mail",
      html: str,
    }

    mailer.sendMail(mailOptions, async (err, info) => {
      if (err) {
        return await errorResponse(res, 500, 0, err.message)
      }
      console.log("Message sent: %s", info.messageId)
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    })

    await session.commitTransaction()

    return await successResponse(
      res,
      201,
      1,
      config.messages.registrationSuccessful
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

export const verifyEmail = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const token = req.body.token

    const user = await User.findOne({ token })
    if (!user) {
      return await errorResponse(
        res,
        400,
        0,
        config.messages.invalidTokenOnVerifyEmail
      )
    }

    await user.updateOne({ token: "", emailVerified: 1 }, { session })

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.emailAlreadyVerified
    )
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const logout = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    await Token.create(
      [
        {
          userId: req.user._id,
          keyName: req.key,
          token: req.token,
        },
      ],
      { session }
    )

    await session.commitTransaction()

    return await successResponse(res, 200, 1, config.messages.logoutSuccessful)
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const forgotPassword = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return await errorResponse(
        res,
        400,
        0,
        config.messages.emailNotRegistered
      )
    }

    const token = crypto.randomBytes(32).toString("hex")

    await user.updateOne({ token }, { session })

    const mailer = await createTransport()

    const mailData = {
      name: `${user.firstName} ${user.lastName}`,
      link: `${req.headers.host}/auth/resetPassword/${token}`,
    }

    const str = await ejs.renderFile(
      "src/views/emails/forgot-password.ejs",
      mailData,
      { async: true }
    )
    const mailOptions = {
      from: "Starter <starter@starter.com>",
      to: req.body.email,
      subject: "Forgot Password Mail",
      html: str,
    }

    mailer.sendMail(mailOptions, async (err, info) => {
      if (err) {
        return await errorResponse(res, 500, 0, err.message)
      }
      console.log("Message sent: %s", info.messageId)
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    })

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.forgotPasswordSuccessful
    )
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const resetPassword = async (req, res) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const token = req.body.token

    const user = await User.findOne({ token })
    if (!user) {
      return await errorResponse(
        res,
        400,
        0,
        config.messages.invalidTokenOnResetPassword
      )
    }

    const salt = bcrypt.genSaltSync(config.auth.bcryptSaltLength)
    const hashPassword = bcrypt.hashSync(req.body.password, salt)

    await user.updateOne({ token: "", password: hashPassword }, { session })

    await session.commitTransaction()

    return await successResponse(
      res,
      200,
      1,
      config.messages.resetPasswordSuccessful
    )
  } catch (error) {
    await session.abortTransaction()
    return await errorResponse(res, 500, 0, error.message)
  } finally {
    await session.endSession()
  }
}

export const profile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })

    return await successResponse(res, 200, 1, config.messages.getProfile, user)
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
