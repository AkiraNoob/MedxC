const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSocialLinkSchema = {
  body: Joi.object().keys({
    link: Joi.string().required(),
    socialNetwork: Joi.string().valid(
      'facebook',
      'messenger',
      'instagram',
      'twitter',
      'skype',
      'linkedIn',
      'whatsapp',
      'tiktok',
      'reddit',
      'discord',
      'pinterest',
      'dribble',
      'youtube',
      'behance',
      'telegram',
      'tumblr',
      'spotify',
      'website'
    ),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const updateSocialLinkSchema = {
  body: Joi.object().keys({
    link: Joi.string().allow(null, ''),
    socialNetwork: Joi.string().valid(
      'facebook',
      'messenger',
      'instagram',
      'twitter',
      'skype',
      'linkedIn',
      'whatsapp',
      'tiktok',
      'reddit',
      'discord',
      'pinterest',
      'dribble',
      'youtube',
      'behance',
      'telegram',
      'tumblr',
      'spotify',
      'website'
    ),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const getProfileSchema = {
  query: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

const createScientific = {
  body: Joi.object().keys({
    scientificName: Joi.string().required(),
    publisher: Joi.string().required(),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const quickStart = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    schoolName: Joi.string().optional().allow(""),
    major: Joi.string().optional().allow(""),
    workPlace: Joi.string().optional().allow(""),
    position: Joi.string().optional().allow(""),
  }),
};

const updateAvatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};

const updateScientific = {
  params: Joi.object().keys({
    scientificId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    scientificName: Joi.string().allow(null, ''),
    publisher: Joi.string().allow(null, ''),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const paramsScientific = {
  params: Joi.object().keys({
    scientificId: Joi.required().custom(objectId),
  }),
};

const createReward = {
  body: Joi.object().keys({
    rewardName: Joi.string().required(),
    organization: Joi.string().required(),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('public', 'private', 'protected'),
  }),
};

const updateReward = {
  params: Joi.object().keys({
    rewardId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    rewardName: Joi.string().allow(null, ''),
    organization: Joi.string().allow(null, ''),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('public', 'private', 'protected'),
  }),
};

const deleteReward = {
  params: Joi.object().keys({
    rewardId: Joi.string().custom(objectId),
  }),
};

const createContact = {
  body: Joi.object().keys({
    contactInfo: Joi.string().required(),
    contactType: Joi.string().valid('personalPhone', 'personalEmail', 'workPhone', 'workEmail'),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const updateContact = {
  params: Joi.object().keys({
    contactId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    contactInfo: Joi.string().allow(null, ''),
    contactType: Joi.string().valid('personalPhone', 'personalEmail', 'workPhone', 'workEmail'),
    viewPermission: Joi.string().valid('protected', 'private', 'public'),
  }),
};

const paramsContactId = {
  params: Joi.object().keys({
    contactId: Joi.required().custom(objectId),
  }),
};

const createCertificate = {
  body: Joi.object().keys({
    certificateName: Joi.string().required(),
    organization: Joi.string().required(),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('public', 'private', 'protected'),
  }),
};

const updateCertificate = {
  params: Joi.object().keys({
    certificateId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    certificateName: Joi.string().allow(null, ''),
    organization: Joi.string().allow(null, ''),
    grantDate: Joi.date().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    viewPermission: Joi.string().valid('public', 'private', 'protected'),
  }),
};
const paramsCertficate = {
  params: Joi.object().keys({
    certificateId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createScientific,
  updateScientific,
  paramsScientific,
  createSocialLinkSchema,
  updateSocialLinkSchema,
  getProfileSchema,
  createContact,
  updateContact,
  paramsContactId,
  createReward,
  updateReward,
  deleteReward,
  createCertificate,
  updateCertificate,
  paramsCertficate,
  quickStart,
  updateAvatar,
};
