const express = require('express');
const router = express.Router();
const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const profileRoute = require('./profile.route');
const notificationRoute = require('./notification.route');
const followRoute = require('./follow.route.js');

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/notification',
    route: notificationRoute,
  },
  {
    path: '/follow',
    route: followRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
