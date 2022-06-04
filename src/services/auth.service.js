const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { DigitCode } = require('../models');
const { axios } = require('../config/axios');
const digitCodeService = require('./digitCode.service');
const emailService = require('./emailServices/email.service');
const { Profile } = require('../models/profile');
const { issueJWT, verifyToken } = require('../utils/jwt');

const jwtDecode = require('jwt-decode');
/**
 * Login with username and password
 * @param {string} email(use identity instead because of qbank /auth/login)
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async ({ email, password }) => {
  try {
    let emailIsValid = await axios.post('/auth/check-user-email', {
      email,
    });

    //email is not verified? We dont let them login
    if (emailIsValid.data.canContinue) {
      let { data } = await axios.post('/auth/login', { identity: email, password });
      delete data.user.isActive;
      delete data.user.isNewUser;
      //case: user has account in qbank but does not have profile in medxC

      let qbankUserProfile = await axios.getQbankProfile(data.token);

      // map from object to string to fit model

      const avatar = qbankUserProfile.data.avatar;
      qbankUserProfile.data.avatar = avatar ? avatar.url : avatar;

      let userId = (await verifyToken(data.token)).sub.id;

      await Profile.findOneAndUpdate(
        {
          ownerId: userId,
        },
        { qbankData: qbankUserProfile.data },
        {
          upsert: true,
        }
      );

      data.accessToken = { token: data.token, expires: data.exprires };
      data.userId = userId;
      delete data.token;
      delete data.exprires;
      return { data };
    }

    return emailIsValid.data;
  } catch (error) {
    throw new ApiError(error.response.data.statusCode, error.response.data.message);
  }
};

/**
 * Login with google
 * @param {string} idToken
 * @returns {Promise<User>}
 */
const loginWithGoogle = async (idToken) => {
  try {
    const { data } = await axios.post('/auth/login/google', {
      token: idToken,
    });

    let qbankUserProfile = await axios.getQbankProfile(data.token);

    // map from object to string to fit model

    const avatar = qbankUserProfile.data.avatar;
    qbankUserProfile.data.avatar = avatar ? avatar.url : avatar;

    let userId = (await verifyToken(data.token)).sub.id;

    await Profile.findOneAndUpdate(
      {
        ownerId: userId,
      },
      { qbankData: qbankUserProfile.data },
      {
        upsert: true,
      }
    );

    data.accessToken = { token: data.token, expires: data.exprires };
    data.userId = userId;
    data.user.fullname = qbankUserProfile.data.fullName;
    delete data.token;
    delete data.exprires;
    return { data };
  } catch (error) {
    throw new ApiError(error.response.data.statusCode, error.response.data.message);
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (email, digitCode) => {
  try {
    let { message, status } = await digitCodeService.verifyDigitCode(email, digitCode);

    if (status === 200) {
      const { data } = await axios.post('/auth/verify-medxc-email', {
        email,
      });

      const { token } = issueJWT(data.id);

      let qbankUserProfile = await axios.getQbankProfile(token);

      await Profile.findOneAndUpdate(
        {
          ownerId: data.id,
        },
        { qbankData: qbankUserProfile.data },
        { upsert: true }
      );

      let user = {
        isVerified: data.isVerify,
        email: data.email,
      };

      return {
        message: 'Your email was verified successful.',
        status,
        user,
      };
    }

    return { message, status };
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Save a digit code
 * @param {string} digit
 * @param {string} email
 * @param {Moment} expires
 * @param {boolean} [blacklisted]
 * @returns {Promise<Digit>}
 */
const saveDigitCode = async (digit, email, expires, blacklisted = false) => {
  // disable all old digit code
  await DigitCode.findOneAndUpdate(
    { email: email, verify: { $elemMatch: { isActive: true } } },
    {
      $set: { 'verify.$.isActive': false },
    }
  );

  // save new valid digit code
  const digitDoc = await DigitCode.findOneAndUpdate(
    { email: email },
    {
      email: email,
      $push: { verify: { digitCode: digit, expires: expires, createdAt: Date.now(), isActive: true } },
      blacklisted,
    },
    { upsert: true }
  );
  return digitDoc;
};

/**
 * Generate digit code and save it in db
 * @param {string} email
 * @returns {Object} digit
 */
const generateDigitCode = async (email) => {
  let minutesToResendEmail = 2;
  let limitEmailInDay = 5;
  let minutesToExpired = 3;

  const code = {
    minutesToResendEmail: 0,
    limitEmailInDay: 1,
  };

  const digitDoc = await DigitCode.findOne({ email: email });
  if (digitDoc) {
    if (Date.parse(digitDoc.updatedAt) + minutesToResendEmail * 60000 > Date.now()) {
      return {
        digit: undefined,
        message: 'Send email request limit for 3 minutes. Try again after a couple off minutes!',
        code: 403,
      };
    }
    let digitInDay = digitDoc.verify.filter((item) => {
      let now = new Date();
      return (
        item.createdAt.getDate() == now.getDate() &&
        item.createdAt.getMonth() == now.getMonth() &&
        item.createdAt.getFullYear() == now.getFullYear()
      );
    });
    if (digitInDay.length >= limitEmailInDay) {
      return { digit: undefined, message: 'You have reach send email limit for today!', code: 400 };
    }
  }

  // generate digit code
  let digit = Math.floor(Math.random() * 1000000 + 1).toString();
  // handle number un 6 digit case
  if (digit.length < 6) {
    digit = '000000' + digit;
    digit = digit.substring(digit.length - 6, digit.length);
  }

  // digit code invalid after 10 minutes
  let date = new Date();
  let exp = new Date(date.getTime() + minutesToExpired * 60000);

  // store digit code in db
  await saveDigitCode(digit, email, exp);

  return { digit: digit, message: 'success', code: 200 };
};

/**
 * Check digit code valid with email or not
 * @param {string} email
 * @param {number} digitCode
 * @returns {Object}
 */
const confirmCode = async (email, digitCode) => {
  let message = await digitCodeService.verifyDigitCode(email, digitCode);

  return message;
};

/**
 * Set new password for user
 * @param {string} email
 * @param {number} digitCode
 * @param {string} newPassword
 * @returns {Object}
 */
const setNewPassword = async (email, digitCode, newPassword) => {
  try {
    const result = await digitCodeService.verifyDigitCode(email, digitCode);
    if (result.status === 200) {
      const body = { email: email, verifyCode: 'newPasswordMedcom', newPassword: newPassword };
      const res = await axios.put('/auth/set-new-password-for-medcom', body);
      if (res.data.statusCode == 200) {
        return { message: 'success', statusCode: 200 };
      }
    } else {
      return { message: 'invalid digit code', statusCode: 403 };
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Somethings went wrong!');
  }
};

/**
 * Resend digit code
 * @param {string} email
 * @returns {Object}
 */
const resendCode = async (email) => {
  try {
    await axios.put('/user/reset-digit-input-times', { email });

    // let emailIsValid = await axios.post('/auth/check-user-email', {
    //   email,
    // });

    const isEmailExist = await userService.checkEmailRegistered(email);

    if (isEmailExist) {
      let { digit, message, code } = await generateDigitCode(email);
      if (digit == undefined) {
        return { message, code, statusCode: httpStatus.FORBIDDEN };
      } else {
        await emailService.resendCodeEmail(email, digit);
        return {
          message: 'Code was resent. Check your email',
          statusCode: httpStatus.OK,
        };
      }
    }

    return { message: 'Email is not exist', statusCode: httpStatus.NOT_FOUND };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  loginWithGoogle,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  generateDigitCode,
  confirmCode,
  setNewPassword,
  resendCode,
};
