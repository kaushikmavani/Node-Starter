import Joi from "joi"

export const changePasswordRequest = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(30).required(),
    retypeNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
}

export const updateProfileRequest = {
  body: Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
  }),
}
