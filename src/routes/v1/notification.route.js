const express = require('express');
const validate = require('../../middlewares/validate');
const notificationController = require('../../controllers/notification.controller')
const notificationValidation = require('../../validations/notification.validation')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/all', auth(), validate(notificationValidation.getNotificationSchema), notificationController.getAllNotification);
router.put('/update-count', auth(), notificationController.updateNotificationCount);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Everything about notification
 */

/**
 * @swagger
 * /notification/all:
 *   get:
 *     summary: get all notification
 *     tags: [Notification]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: page
 *        in: query
 *        schema:
 *          type: number
 *      - :
 *        name: limit
 *        in: query
 *        schema:
 *          type: number
 *     responses:
 *       "200":
 *         description: Success
 */

/**
 * @swagger
 * /notification/update-count:
 *   put:
 *     summary: update notification count in profile
 *     tags: [Notification]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Success
 */