const { DigitCode } = require('../models');
const { axios } = require('../config/axios');

/**
 *
 * @param {*} email
 * @param {*} digitCode
 * @returns {Promise<Object>}
 */
const verifyDigitCode = async (email, digitCode) => {
  const digitCodeDoc = await DigitCode.findOne({ email });
  if (!digitCodeDoc) {
    return { message: 'email request is not exist', status: 404 };
  }

  // get active digit code in db
  let activeDigitCode = digitCodeDoc.verify.filter((item) => {
    return item.isActive === true;
  });

  if (activeDigitCode.length <= 0) {
    return { message: 'There is no active digit code', status: 400 };
  }

  if (activeDigitCode[0].digitCode == digitCode) {
    await axios.put('/user/reset-digit-input-times', { email });

    if (Date.parse(activeDigitCode[0].expires) > Date.now()) {
      return { message: 'digit code is valid', status: 200 };
    } else {
      return { message: 'digit code is expired', status: 403 };
    }
  } else {
    const {
      data: { reachLimitInput },
    } = await axios.post('/user/digit-input-times', {
      email,
    });

    if (reachLimitInput) {
      // disable all old digit code
      await DigitCode.findOneAndUpdate(
        { email: email, verify: { $elemMatch: { isActive: true } } },
        {
          $set: { 'verify.$.isActive': false },
        }
      );

      return { message: 'Reach digit input times.Please resend code', status: 406 };
    }

    return { message: 'digit code is invalid', status: 400 };
  }
};

module.exports = {
  verifyDigitCode,
};
