const httpStatus = require('http-status');
const { Profile } = require('../models/profile');
const { Notification } = require('../models');
const { axios } = require('../config/axios');
const ApiError = require('../utils/ApiError');

const notificationTest = async (...args) => {
  console.log(args);
};

/**
 * get all notification
 * @param {*} user
 * @param {Number} page
 * @param {Number} limit
 * @returns {*}
 */
const getAllNotification = async (user, page = 1, limit = 10) => {
  const list = await Notification.find({ ownerId: user.id })
    .populate('fromId', ['qbankData.fullName', 'avatar', 'ownerId'])
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ createdAt: 'desc' });
  const count = await Notification.find({ ownerId: user.id }).count();
  return {
    statusCode: httpStatus.OK,
    message: 'success',
    data: {
      list,
      count,
    },
  };
};

/**
 * update notification count
 * @param {*} user
 * @returns {*}
 */
const updateNotificationCount = async (user) => {
  await Profile.findOneAndUpdate({ ownerId: user.id }, { notificationCount: 0 });
  return { statusCode: httpStatus.OK, message: 'success', data: null };
};

const createFollowNotification = async ({ receiveFollowRequestUserId, sendRequestFollowProfileId }) => {
  let noti = await Notification.create({
    ownerId: receiveFollowRequestUserId,
    fromId: sendRequestFollowProfileId,
    typeNoti: 'follow',
  });

  return noti;
};

const createAcceptFollowNotification = async ({ receiveAcceptFollowRequestUserId, sendAcceptFollowProfileId }) => {
  let noti = await Notification.create({
    ownerId: receiveAcceptFollowRequestUserId,
    fromId: sendAcceptFollowProfileId,
    typeNoti: 'accept-follow',
  });

  return noti;
};

const triggerFollowNotification = async ({ followerId, ownerId }) => {
  let noti = await Notification.find({
    ownerId,
  }).populate({
    path: 'fromId',
    select: { ownerId: 1 },
  });

  if (noti) {
    noti = noti.find((noti) => {
      return noti.fromId.ownerId == followerId;
    });
  }

  return noti;
};

module.exports = {
  notificationTest,
  getAllNotification,
  updateNotificationCount,
  createFollowNotification,
  triggerFollowNotification,
  createAcceptFollowNotification,
};
