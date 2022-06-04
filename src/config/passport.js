const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const config = require('./config');

const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', '..', 'id.ecdsa.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const { axios } = require('../config/axios');

const jwtOptions = {
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await axios.post('/user/get-user-by-id', {
      id: payload.sub,
    });

    let encloseToRequest = {
      id: user.data.id,
      email: user.data.email,
      roleId: user.data.roleId,
    };

    if (user) {
      return done(null, encloseToRequest);
    }

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
