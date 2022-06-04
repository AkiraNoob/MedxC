const httpStatus = require('http-status');
const jwtDecode = require('jwt-decode');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { axios } = require('../config/axios');
const { verifyToken } = require('../utils/jwt');
const { Profile } = require('../models/profile');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    let { data } = await axios.post('/auth/register', userBody);

    let userID = (await verifyToken(data.token)).sub.id;
    data.userID = userID;

    let userProfile = new Profile({
      ownerId: userID,
      bio: '',
    });

    await userProfile.save();

    delete data.exprires;
    delete data.token;

    return data;
  } catch (error) {
    throw new ApiError(error.response.data.statusCode, error.response.data.message);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Check email have registered or not
 * @param {string} email
 * @returns {boolean} exist
 */
const checkEmailRegistered = async (email) => {
  try {
    const res = await axios.post('/auth/validateStep1', { email: email });
    if (res.data.found === false) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    // if (error.response.stauts == 302) {
    return true;
  }
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const resetPassword = async (token, oldPassword, newPassword) => {
  try {
    const userId = jwtDecode(token);
    const { data } = await axios.patch(
      '/user/change-password',
      {
        userId,
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return data;
  } catch (error) {
    throw new ApiError(error.response.data.statusCode, error.response.data.message);
  }
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  checkEmailRegistered,
  resetPassword,
};
