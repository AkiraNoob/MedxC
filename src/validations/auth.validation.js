const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    fullName: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const loginWithGoogle = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    digitCode: Joi.string().required(),
  }),
};

const confirmCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    digitCode: Joi.string().required(),
  }),
};

const setNewPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    digitCode: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const resendCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  register,
  login,
  loginWithGoogle,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  confirmCode,
  setNewPassword,
  resendCode,
};
