import config from "../config/app.config.js"
import Version from "../models/Version.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

export const getVersions = async (req, res) => {
  try {
    const versions = await Version.find()

    const message = versions.length
      ? config.messages.getVersions
      : config.messages.dataNotFound
    return await successResponse(res, 200, 1, message, versions)
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
