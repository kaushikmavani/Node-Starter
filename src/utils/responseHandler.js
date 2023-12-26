import prepareResponse from "./prepareResponse.js"

export const errorResponse = async (
  res,
  statusCode,
  responseCode,
  responseMsg
) => {
  try {
    console.log(responseMsg)
    let response = {
      responseCode: responseCode,
      responseMsg: responseMsg,
      result: false,
      serverTime: "UTC",
    }

    response = await prepareResponse(JSON.stringify(response))
    return res.status(statusCode).json(response)
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}

export const successResponse = async (
  res,
  statusCode,
  responseCode,
  responseMsg,
  data = ""
) => {
  try {
    let response = {
      responseCode: responseCode,
      responseMsg: responseMsg,
      result: true,
      serverTime: "UTC",
    }
    if (data !== "") response.data = data

    response = await prepareResponse(JSON.stringify(response))
    return res.status(statusCode).json(response)
  } catch (error) {
    return await errorResponse(res, 500, 0, error.message)
  }
}
