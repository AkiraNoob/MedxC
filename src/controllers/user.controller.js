const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { Response } = require('../utils/httpResponse');
const DeviceDetector = require('device-detector-js')

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await userService.resetPassword(req.headers.authorization, oldPassword, newPassword);
  res.send(result);
});

const getUserAgent = catchAsync(async (req, res) => {
  const userAgent = req.get('User-Agent');
  const platform = req.get('sec-ch-ua-platform');
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(userAgent);
  console.log(device)
  const clientName = device.client.name;
  const osName = device.os.name;
  Response(res, httpStatus.OK, "success", { userAgent, platform, clientName, osName })
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserAgent,
};
