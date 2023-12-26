import { successResponse, errorResponse } from "../utils/responseHandler.js"
import Key from "../models/Key.js"
import config from "../config/app.config.js"

export const getKey = async (req, res) => {
  try {
    let key = await Key.findOne()

    const message = key ? config.messages.getKey : config.messages.dataNotFound
    return await successResponse(res, 200, 1, message, key)
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
