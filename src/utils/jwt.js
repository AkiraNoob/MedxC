const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { axios } = require('../config/axios');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const pathToPubKey = path.join(__dirname, '..', '..', 'id.ecdsa.pem');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const pathToPrivateKey = path.join(__dirname, '..', '..', 'id.ecdsa');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

/**
 * @param {string} token - A JsonWebToken string used to be verified
 */
const verifyToken = async (token) => {
  const options = {
    algorithms: ['RS256'],
    ignoreExpiration: true, //ignore expired token
    complete: true,
  };
  try {
    let {
      payload: { sub, iat },
      header,
    } = await jwt.verify(token, PUB_KEY, options);

    /**
     * decoded structure:
     * {
        header: { alg: 'RS256', typ: 'JWT' },
        payload: { sub: 7475, iat: 1651327123, exp: 1651931923 }, //sub is userId
        signature: 
      }
    */

    const user = await axios.post('/user/get-user-by-id', {
      id: sub,
    });

    let encloseToRequest = {
      id: user.data.id,
      email: user.data.email,
      roleId: user.data.roleId,
    };

    return { sub: encloseToRequest, iat, header }; //reduce fields
  } catch (error) {
    console.log(error);

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = error.message;

    if (error.isAxiosError) {
      console.log('isAxiosError: ', error.isAxiosError);
      message = error.response.data.message;
    }

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, message);
  }
};

/**
 * @param {*} userId - Set the JWT `sub` payload property to the user ID
 */
function issueJWT(userId) {
  const expiresIn = '7d';

  const payload = {
    sub: userId,
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: signedToken,
  };
}

module.exports = {
  verifyToken,
  issueJWT,
};
