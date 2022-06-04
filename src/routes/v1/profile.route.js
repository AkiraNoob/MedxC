const express = require('express');
const validate = require('../../middlewares/validate');
const profileValidation = require('../../validations/profile.validation');
const profileController = require('../../controllers/profile.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/follow/getFollowList', profileController.getFollowList);

router.get('/:userId', profileController.getProfile);
router.get('/school/:schoolId', auth(), profileController.getSchoolById);
router.get('/experience/:experienceId', auth(), profileController.getExperienceById);

router.get('/social/:socialLinkId', auth(), profileController.getSocialById);
router.post('/social', auth(), validate(profileValidation.createSocialLinkSchema), profileController.createSocialLink);
router.put(
  '/edit-social/:socialLinkId',
  auth(),
  validate(profileValidation.updateSocialLinkSchema),
  profileController.updateSocialLink
);
router.delete('/delete-social/:socialLinkId', auth(), profileController.deleteSocialLink);

router.put('/edit-profile', auth(), profileController.editProfile);
router.post('/school', auth(), profileController.createSchool);
router.put('/edit-school/:schoolId', auth(), profileController.updateSchool);
router.delete('/delete-school/:schoolId', auth(), profileController.deleteSchool);
router.post('/experience', auth(), profileController.createExperience);
router.put('/edit-experience/:experienceId', auth(), profileController.updateExperience);
router.delete('/delete-experience/:experienceId', auth(), profileController.deleteExperience);
router.post('/reward', auth(), validate(profileValidation.createReward), profileController.createReward);

router.put('/edit-reward/:rewardId', auth(), validate(profileValidation.updateReward), profileController.updateReward);

router.delete('/delete-reward/:rewardId', auth(), validate(profileValidation.deleteReward), profileController.deleteReward);

router.post('/scientific', auth(), validate(profileValidation.createScientific), profileController.createScientific);

router.put(
  '/edit-scientific/:scientificId',
  auth(),
  validate(profileValidation.updateScientific),
  profileController.updateScientific
);

router.delete(
  '/delete-scientific/:scientificId',
  auth(),
  validate(profileValidation.paramsScientific),
  profileController.deleteScientific
);

router.post('/contact', auth(), validate(profileValidation.createContact), profileController.createContact);

router.put('/edit-contact/:contactId', auth(), validate(profileController.updateContact), profileController.updateContact);
router.delete(
  '/delete-contact/:contactId',
  auth(),
  validate(profileController.paramsContactId),
  profileController.deleteContact
);

router.post('/certificate', auth(), validate(profileValidation.createCertificate), profileController.createCertificate);

router.put(
  '/edit-certificate/:certificateId',
  auth(),
  validate(profileValidation.updateCertificate),
  profileController.updateCertificate
);

router.delete(
  '/delete-certificate/:certificateId',
  auth(),
  validate(profileValidation.paramsCertficate),
  profileController.deleteCertificate
);

router.post('/quick-start', auth(), validate(profileValidation.quickStart), profileController.quickStart);
router.put('/avatar', auth(), validate(profileValidation.updateAvatar), profileController.updateAvatar);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Everything about profile
 */

/**
 * @swagger
 * /profile/follow/getFollowList:
 *  get:
 *     summary: Get follower and following list
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Success
 */

/**
 * @swagger
 * /profile/school:
 *   post:
 *     summary: create new school for user in accessToken
 *     tags: [Profile]
 *     description: all attribute in body are required
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       "201":
 *         description: Success
 *       "400":
 *         description: endDate must after startDate
 */

/**
 * @swagger
 * /profile/quick-start:
 *   post:
 *     summary: quick start
 *     tags: [Profile]
 *     description: all attribute in body are NOT required
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 required: true
 *               schoolName:
 *                 type: string
 *               major:
 *                 type: string
 *               workPlace:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Success
 *       "404":
 *         description: profile not found
 */

/**
 * @swagger
 * /profile/avatar:
 *   put:
 *     summary: update avatar
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 required: true
 *     responses:
 *       "200":
 *         description: Success
 *       "401":
 *         description: invalid credential
 *       "400":
 *         description: validate error
 */

/**
 * @swagger
 * /profile/edit-profile:
 *   put:
 *     summary: CUD profile bio
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *             properties:
 *               bio:
 *                 type: string
 *     responses:
 *       "200":
 *         description: Success
 */

/**
 * @swagger
 * /profile/school:
 *   post:
 *     summary: create new school for user in accessToken
 *     tags: [Profile]
 *     description: all attribute in body are required
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       "201":
 *         description: Success
 *       "400":
 *         description: endDate must after startDate
 */

/**
 * @swagger
 * /profile/scientific:
 *   post:
 *     summary: Create a new scientific
 *     tags: [Profile]
 *     description: Logged in users can create new scientific with accessToken
 *             $ref: '#/components/schemas/Scientific'
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /profile/edit-school/{schoolId}:
 *   put:
 *     summary: update school
 *     tags: [Profile]
 *     description: all attribute in body are NOT required
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: schoolId
 *        in: path
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/School'
 *     responses:
 *       "200":
 *         description: Success
 *       "400":
 *         description:  viewPermission must in enum
 *       "401":
 *         description: unauthorize
 *       "403":
 *         description: endDate must after startDate
 *       "404":
 *         description: not found this school in your profile
 */
/**
 * @swagger
 * /profile/edit-scientific/{scientificId}:
 *   put:
 *     summary: Update scientific by scientificId
 *     tags: [Profile]
 *     description: Logged in users can update their scientific with scientificId
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: scientificId
 *        in: path
 *        schema:
 *          type: string

/**
 * @swagger
 * /profile/delete-school/{schoolId}:
 *   delete:
 *     summary: delete school
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: schoolId
 *        in: path
 *        schema:
 *          type: string
 *     responses:
 *       "200":
 *         description: Success
 *       "401":
 *         description: unauthorize
 *       "404":
 *         description: not found this school in your profile
 */

/**
 * @swagger
 * /profile/experience:
 *   post:
 *     summary: create new experience for user in accessToken
 *     tags: [Profile]
 *     description: all attribute in body are required
 *     security:
 *      - bearerAuth: []
 * /profile/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: integer
 *        required: true
 *        description: Profile owner id
 *      - in: query
 *        name: accessToken
 *        schema:
 *          type: string
 *        required: true
 *        description: Viewer access token
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                  type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                    viewPermission:
 *                      type: object
 *                      properties:
 *                        viewPermission:
 *                          type: string
 *                        isAccepted:
 *                          type: boolean
 *                    profiles:
 *                      type: object
 *       "404":
 *          description: PROFILE_NOT_FOUND
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 */

// SOCIAL

/**
 * @swagger
 * /profile/social:
 *   post:
 *     summary: '[User] create new social link'
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - link
 *             properties:
 *               link:
 *                 type: string
 *                 description: Social media url
 *               socialNetwork:
 *                 type: string
 *                 description: Social media name[follow the enum guide otherwise get error]
 *               viewPermission:
 *                 type: string
 *             example:
 *               link: https://whatsapp.com/,
 *               socialNetwork: whatsapp,
 *               viewPermission: protected
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                  type: integer
 *                 message:
 *                  type: string
 *                 data:
 *                  type: object
 *                  properties:
 *                   ownerId:
 *                    type: integer
 *                   socialLinkId:
 *                    type: string
 *       "401":
 *          description: UNAUTHORIZED
 *       "404":
 *          description: NOT_FOUND
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 */

/**
 * @swagger
 * /profile/edit-experience/{experienceId}:
 *   put:
 *     summary: update experience
 *     description: all attribute in body are NOT required
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: experienceId
 *        in: path
 *        schema:
 *          type: string
 *          $ref: '#/components/schemas/Experience'
 *     responses:
 *       "201":
 *         description: Success
 *       "400":
 *         description: endDate must after startDate
 *       "404":
 *         description: profile not found
 *
 * /profile/edit-social:
 *   put:
 *     summary: '[User] edit social link'
 *     tags: [Profile]
 *     parameters:
 *      - in: path
 *        name: socialLinkId
 *        schema:
 *          type: string
 *        required: true
 *        description: social_link's id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - link
 *             properties:
 *               link:
 *                 type: string
 *                 description: Social media url
 *               socialNetwork:
 *                 type: string
 *                 description: Social media name[follow the enum guide otherwise get error]
 *               viewPermission:
 *                 type: string
 *             example:
 *               link: https://whatsapp.com/
 *               socialNetwork: whatsapp
 *               viewPermission: protected
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                  type: integer
 *                 message:
 *                  type: string
 *       "401":
 *          description: UNAUTHORIZED
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 *             $ref: '#/components/schemas/Scientific'
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description:  viewPermission must in enum ['protected', 'private', 'public']
 *       "401":
 *         description: Unauthorize
 *       "404":
 *         description: Not found scientific with that ID
 */

/**
 * @swagger
 * /profile/delete-experience/{experienceId}:
 *   delete:
 *     summary: delete school
 * /profile/delete-scientific/{scientificId}:
 *   delete:
 *     summary: Delete a scientific by scientificId
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: experienceId
 *      - name: scientificId
 *        in: path
 *        schema:
 *          type: string
 *     responses:
 *       "200":
 *         description: Success
 *       "401":
 *         description: unauthorize
 *       "404":
 *         description: not found this experience in your profile
 * /profile/delete-social:
 *   delete:
 *     summary: '[User] delete social link'
 *     tags: [Profile]
 *     parameters:
 *      - in: path
 *        name: socialLinkId
 *        schema:
 *          type: string
 *        required: true
 *        description: social_link's id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                  type: integer
 *                 message:
 *                  type: string
 *       "401":
 *          description: UNAUTHORIZED
 *       "403":
 *          description: FORBIDDEN
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 *         description: No content
 *       "401":
 *         description: Unauthorize
 *       "404":
 *         description: Not found scientific with that ID
 */

/**
 * @swagger
 * /profile/contact:
 *   post:
 *     summary: '[User] create new a contact'
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       "201":
 *         description: CREATED
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Contact'
 *       "401":
 *          description: UNAUTHORIZED
 *       "404":
 *          description: NOT_FOUND
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 *
 * /profile/contact/{contactId}:
 *   get:
 *     summary: '[User] get a contact by contactId'
 *     tags: [Profile]
 *     parameters:
 *      - :
 *        name: contactId
 *        in: path
 *        schema:
 *          type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Contact'
 *       "401":
 *          description: UNAUTHORIZED
 *       "404":
 *          description: NOT_FOUND
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 *
 * /profile/edit-contact/{contactId}:
 *   put:
 *     summary: '[User] edit contact info'
 *     tags: [Profile]
 *     parameters:
 *      - :
 *        name: contactId
 *        in: path
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Contact'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                  type: integer
 *                 message:
 *                  type: string
 *       "401":
 *          description: UNAUTHORIZED
 *       "404":
 *         description: Not found scientific with that ID
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 * /profile/delete-contact/{contactId}:
 *   delete:
 *     summary: delete contact
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: contactId
 *        in: path
 *        schema:
 *          type: string
 *     responses:
 *       "200":
 *         description: Success
 *       "401":
 *         description: unauthorize
 *       "404":
 *         description: not found this contact in your profile
 *       "500":
 *          description: INTERNAL_SERVER_ERROR
 */
/**
 * @swagger
 * /profile/reward:
 *   post:
 *     summary: Create a new reward
 *     tags: [Profile]
 *     description: Logged in users can create new reward with accessToken
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /profile/edit-reward/{rewardId}:
 *   put:
 *     summary: Update reward by rewardId
 *     tags: [Profile]
 *     description: Logged in users can update their reward with rewardId
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: rewardId
 *        in: path
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reward'
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description:  viewPermission must in enum ['protected', 'private', 'public']
 *       "401":
 *         description: Unauthorize
 *       "404":
 *         description: Not found reward with that ID
 */

/**
 * @swagger
 * /profile/delete-reward/{rewardId}:
 *   delete:
 *     summary: Delete a reward by rewardId
 *     tags: [Profile]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - :
 *        name: rewardId
 *        in: path
 *        schema:
 *          type: string
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         description: Unauthorize
 *       "404":
 *         description: Not found reward with that ID
 */
