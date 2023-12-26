import { errorResponse } from "../utils/responseHandler.js"
import Key from "../models/Key.js"
import config from "../config/app.config.js"

export default async (req, res, next) => {
  try {
    if (!req.headers.key) {
      return await errorResponse(res, 500, 0, config.messages.keyNotPassed)
    }

    const keyName = req.headers.key

    const keyExist = await Key.findOne({ keyName })
    if (!keyExist) {
      return await errorResponse(res, 500, 0, config.messages.invalidKey)
    }

    req.key = keyName

    next()
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
