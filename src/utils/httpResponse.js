/**
 * Response format for all apis
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {String | null} data
 */
const httpResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({ message, data, statusCode });
};

module.exports = {
  Response: httpResponse,
};
