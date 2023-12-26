const messages = {
  // Error Handler
  unexpectedError:
    "An unexpected network error occurred, please try again later.",
  invalidEndpointOrMethod: "Please enter valid endpoint and method.",

  // Middlewares
  keyNotPassed:
    "You are not authorized to access associated web-services, Please enter key.",
  invalidKey:
    "Please enter correct key, entered key doesn't match with provided key.",
  invalidToken:
    "You are not authorized to access associated web-services, Please enter valid token.",
  invalidOrExpireToken:
    "You are not authorized to access associated web-services, it seems token is expired.",
  mismatchKeyAndToken:
    "You are not authorized to access associated web-services, it seems there is mismatch in key-token pair.",

  // Data not found
  dataNotFound: "No data found.",

  // Key
  getKey: "Get key sucessfully.",

  // Version
  getVersions: "Get version list successfully.",

  // Auth
  emailNotRegistered:
    "This email is not registered with us. Please use correct email address.",
  emailNotVerified:
    "Please click on confirmation link sent to your registered email.",
  invalidPassword: "Your password is incorrect.",
  loginSuccessful: "Login successful.",
  emailAlreadyRegistered:
    "This email is already registered with us. Please try another email.",
  registrationSuccessful:
    "Registration has been completed successfully. Please click on the confirmation link sent to your email to activate your account.\n Please check your spam folder too.",
  invalidTokenOnVerifyEmail:
    "Please enter valid token, It seems invalid or expired.",
  emailAlreadyVerified: "Your email has been verified successfully.",
  logoutSuccessful: "Logout successful.",
  forgotPasswordSuccessful:
    "Reset password link has been sent to your registered email address.",
  invalidTokenOnResetPassword:
    "Please enter valid token, It seems invalid or expired.",
  resetPasswordSuccessful:
    "Your password has been changed successfully. Please login with your new password.",
  getProfile: "Get user profile successfully.",

  // User
  invalidOldPassword: "Your old password is incorrect.",
  oldPasswordAndNewPasswordSame:
    "Your new password is same as old password. Please use different new password.",
  changePasswordSuccessful:
    "Your password has been changed successfully. Please login with your new password.",
  updateProfileSuccessful: "Profile updated successfully.",
}

export default messages
