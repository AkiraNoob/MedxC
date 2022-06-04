const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('./config');

let BASE_URL = 'https://api.medx.vn/api/v1';
//let BASE_URL = 'http://localhost:3000/api/v1';

if (config.env === 'production') {
  BASE_URL = 'https://api.medx.vn/api/v1';
}

const axios_config = {
  baseURL: BASE_URL,
};

let instance = axios.create(axios_config);

instance.getQbankProfile = async (accessToken) => {
  try {
    const qbankData = await instance.get('/user/me', { headers: { Authorization: `Bearer ${accessToken}` } });

    return qbankData;
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports.axios = instance;
