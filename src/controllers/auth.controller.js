const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, digitCodeService } = require('../services');
const { axios } = require('../config/axios');

const { emailService } = require('../services/emailServices');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  let userEmail = user.user.email;

  // generate digit code and save in db
  const digitCode = await authService.generateDigitCode(userEmail);

  if (digitCode.digit == undefined) {
    res.status(httpStatus.FORBIDDEN).json({ message: digitCode.message });
  } else {
    await emailService.sendVerificationEmail(userEmail, digitCode.digit);
    res.status(httpStatus.CREATED).json({ ...user, message: 'Verfication email was sent' });
  }
});

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUserWithEmailAndPassword(req.body);
  res.status(httpStatus.OK).json(user);
});

const loginWithGoogle = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  // data includes the user info, token and expires
  const data = await authService.loginWithGoogle(idToken);
  res.send(data);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // email is exist? && email is verified?
  let emailIsValid = await axios.post('/auth/check-user-email', {
    email,
  });

  if (emailIsValid.data.canContinue) {
    // generate digit code and save in db
    const digitCode = await authService.generateDigitCode(email);
    if(digitCode.code === 403){
      res.status(httpStatus.FORBIDDEN).json({ message: digitCode.message, statusCode: digitCode.code });
    }
    if(digitCode.code === 400){
      res.status(httpStatus.BAD_REQUEST).json({ message: digitCode.message, statusCode: digitCode.code });
    }
    if(digitCode.code === 200){
      await emailService.sendResetPasswordEmail(req.body.email, digitCode.digit);
      res.status(httpStatus.OK).json({ message: 'success', statusCode: digitCode.code });
    }
  } else {
    res.status(httpStatus.NOT_FOUND).json({ message: emailIsValid.data.message, statusCode: 404 }).end();
  }
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendResetPasswordEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  let { message, status: statusCode, user } = await authService.verifyEmail(req.body.email, req.body.digitCode);

  if (statusCode === 200) {
    res.json({ message, statusCode, user });
  } else {
    res.json({ message, statusCode });
  }
});

const confirmCode = catchAsync(async (req, res) => {
  const message = await digitCodeService.verifyDigitCode(req.body.email, req.body.digitCode);

  res.status(message.status).json(message);
});

const setNewPassword = catchAsync(async (req, res) => {
  const { email, digitCode, newPassword } = req.body;
  const message = await authService.setNewPassword(email, digitCode, newPassword);
  res.status(httpStatus.OK).json(message);
});

const resendCode = catchAsync(async (req, res) => {
  const response = await authService.resendCode(req.body.email);
  res.json(response);
});

module.exports = {
  register,
  login,
  loginWithGoogle,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  confirmCode,
  setNewPassword,
  resendCode,
};
