const Joi = require('joi');

const getNotificationSchema = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};


module.exports = {
  getNotificationSchema,
};
