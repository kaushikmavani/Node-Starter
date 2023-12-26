import config from "../config/app.config.js"
import { errorResponse } from "./responseHandler.js"

export default async (app) => {
  // handle error (which is not handled inside and unfortunately retured)
  app.use(async (error, req, res, next) => {
    if (!error.status || error.status === 500) {
      return await errorResponse(res, 500, 0, config.messages.unexpectedError)
    } else {
      return await errorResponse(res, error.status, 0, error.message)
    }
  })

  // handle 404
  app.use(async (req, res, next) => {
    return await errorResponse(
      res,
      404,
      0,
      config.messages.invalidEndpointOrMethod
    )
  })
}
