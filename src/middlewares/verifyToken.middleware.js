import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/responseHandler.js"
import config from "../config/app.config.js"
import Token from "../models/Token.js"
import User from "../models/User.js"

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return await errorResponse(res, 401, 0, config.messages.invalidToken)
    }

    const [bearer, token] = req.headers.authorization.split(" ")

    if (!bearer || !token || bearer !== "Bearer") {
      return await errorResponse(res, 401, 0, config.messages.invalidToken)
    }

    const expireToken = await Token.findOne({ keyName: req.key, token })
    if (expireToken) {
      return await errorResponse(
        res,
        401,
        0,
        config.messages.invalidOrExpireToken
      )
    }

    jwt.verify(token, config.auth.jwtSecret, async (err, decoded) => {
      if (err) {
        return await errorResponse(res, 401, 0, config.messages.invalidToken)
      } else {
        if (req.key != decoded.key) {
          return await errorResponse(
            res,
            401,
            0,
            config.messages.mismatchKeyAndToken
          )
        }

        const user = await User.findOne({ _id: decoded.userId })
        if (!user) {
          return await errorResponse(res, 401, 0, config.messages.invalidToken)
        }

        req.token = token
        req.user = user

        next()
      }
    })
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
