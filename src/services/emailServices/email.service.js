const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');
const { resetPasswordTemplate, verifyEmailTemplate, resendCodeTemplate } = require('./emailTemplate');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} digitCode
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, digitCode) => {
  let { html, subject } = resetPasswordTemplate(digitCode);
  await sendEmail(to, subject, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} digitCode
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, digitCode) => {
  let { html, subject } = verifyEmailTemplate(digitCode);
  await sendEmail(to, subject, html);
};

const resendCodeEmail = async (to, digitCode) => {
  let { html, subject } = resendCodeTemplate(digitCode);
  await sendEmail(to, subject, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  resendCodeEmail,
};
