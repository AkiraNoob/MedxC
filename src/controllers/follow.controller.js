const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const followService = require('../services/follow.service');
const { Response } = require('../utils/httpResponse');

const unfollow = catchAsync(async (req, res) => {
  let DTO = await followService.unfollow(req);

  Response(res, httpStatus.OK, 'Unfollow successful', DTO);
});

const remove = catchAsync(async (req, res) => {
  let DTO = await followService.remove(req);

  Response(res, httpStatus.OK, 'Remove successful', DTO);
});

const cancel = catchAsync(async (req, res) => {
  let DTO = await followService.cancel(req);

  Response(res, httpStatus.OK, 'Cancel following successful', DTO);
});

module.exports = {
  unfollow,
  remove,
  cancel,
};
