import Joi from "joi"

export const loginRequest = {
  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }),
}

export const registerRequest = {
  body: Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).max(30).required(),
    retypePassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
}

export const verifyEmailRequest = {
  body: Joi.object({
    token: Joi.string().required(),
  }),
}

export const forgotPasswordRequest = {
  body: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
}

export const resetPasswordRequest = {
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(30).required(),
    retypePassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
}
