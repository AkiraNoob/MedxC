const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../utils/httpResponse');
const notificationService = require('../services/notification.service')
const ApiError = require('../utils/ApiError');

const getAllNotification = catchAsync(async (req, res) => {
  const user = req.user;
  const {page, limit} = req.query;
  const DTO =  await notificationService.getAllNotification(user, page, limit)
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateNotificationCount = catchAsync(async (req, res) => {
  const user = req.user;
  const DTO =  await notificationService.updateNotificationCount(user)
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

module.exports = {
  getAllNotification,
  updateNotificationCount,
}
