const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const profileService = require('../services/profile.service');
const { Response } = require('../utils/httpResponse');
const ApiError = require('../utils/ApiError');
const { axios } = require('../config/axios');

const getFollowList = catchAsync(async (req, res) => {
  let DTO = await profileService.getFollowList(req);

  Response(res, httpStatus.OK, null, DTO);
});

const getProfile = catchAsync(async (req, res) => {
  let DTO = await profileService.getProfile(req);

  Response(res, httpStatus.OK, null, DTO);
});

const editProfile = catchAsync(async (req, res) => {
  let DTO = await profileService.editProfile(req.body, req.user);

  if (DTO === 200) {
    Response(res, httpStatus.OK, 'success', null);
  }
});

const createSchool = catchAsync(async (req, res) => {
  let DTO = await profileService.createSchool(req.body, req.user);

  if (DTO === 201) {
    Response(res, httpStatus.CREATED, 'success', null);
  }
});

const updateSchool = catchAsync(async (req, res) => {
  let DTO = await profileService.updateSchool(req.body, req.user, req.params.schoolId);

  if (DTO === 200) {
    Response(res, httpStatus.OK, 'success', null);
  }
  if (DTO === 404) {
    Response(res, httpStatus.NOT_FOUND, 'not found this school in your profile', null);
  }
  if (DTO === 403) {
    Response(res, httpStatus.FORBIDDEN, 'endDate must after startDate', null);
  }
});

const deleteSchool = catchAsync(async (req, res) => {
  let DTO = await profileService.deleteSchool(req.user, req.params.schoolId);

  if (DTO === 200) {
    Response(res, httpStatus.OK, 'success', null);
  }
  if (DTO === 404) {
    Response(res, httpStatus.NOT_FOUND, 'not found this school in your profile', null);
  }
});

const createExperience = catchAsync(async (req, res) => {
  let DTO = await profileService.createExperience(req.body, req.user);

  if (DTO === 201) {
    Response(res, httpStatus.CREATED, 'success', null);
  }
  if (DTO === 404) {
    Response(res, httpStatus.NOT_FOUND, 'profile not found', null);
  }
});

const updateExperience = catchAsync(async (req, res) => {
  let DTO = await profileService.updateExperience(req.body, req.user, req.params.experienceId);

  if (DTO === 200) {
    Response(res, httpStatus.OK, 'success', null);
  }
  if (DTO === 404) {
    Response(res, httpStatus.NOT_FOUND, 'not found this experience in your profile', null);
  }
  if (DTO === 403) {
    Response(res, httpStatus.FORBIDDEN, 'endDate must after startDate', null);
  }
});

const deleteExperience = catchAsync(async (req, res) => {
  let DTO = await profileService.deleteExperience(req.user, req.params.experienceId);

  if (DTO === 200) {
    Response(res, httpStatus.OK, 'success', null);
  }
  if (DTO === 404) {
    Response(res, httpStatus.NOT_FOUND, 'not found this experience in your profile', null);
  }
});

const getSocialById = catchAsync(async (req, res) => {
  let DTO = await profileService.getSocialById(req);

  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const createSocialLink = catchAsync(async (req, res) => {
  let DTO = await profileService.createSocialLink(req);

  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateSocialLink = catchAsync(async (req, res) => {
  let DTO = await profileService.updateSocialLink(req);

  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const deleteSocialLink = catchAsync(async (req, res) => {
  let DTO = await profileService.deleteSocialLink(req);

  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const getSchoolById = catchAsync(async (req, res) => {
  const DTO = await profileService.getSchoolById(req.user, req.params.schoolId);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const getExperienceById = catchAsync(async (req, res) => {
  const DTO = await profileService.getExperienceById(req.user, req.params.experienceId);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const createScientific = catchAsync(async (req, res) => {
  const DTO = await profileService.createScientific(req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateScientific = catchAsync(async (req, res) => {
  const DTO = await profileService.updateScientific(req.params.scientificId, req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const deleteScientific = catchAsync(async (req, res) => {
  const DTO = await profileService.deleteScientific(req.params.scientificId, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const createReward = catchAsync(async (req, res) => {
  const DTO = await profileService.createReward(req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateReward = catchAsync(async (req, res) => {
  const DTO = await profileService.updateReward(req.params.rewardId, req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const deleteReward = catchAsync(async (req, res) => {
  const DTO = await profileService.deleteReward(req.params.rewardId, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const createContact = catchAsync(async (req, res) => {
  const DTO = await profileService.createContact(req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateContact = catchAsync(async (req, res) => {
  const DTO = await profileService.updateContact(req.params.contactId, req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const deleteContact = catchAsync(async (req, res) => {
  const DTO = await profileService.deleteContact(req.params.contactId, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const createCertificate = catchAsync(async (req, res) => {
  const DTO = await profileService.createCertificate(req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateCertificate = catchAsync(async (req, res) => {
  const DTO = await profileService.updateCertificate(req.params.certificateId, req.body, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const deleteCertificate = catchAsync(async (req, res) => {
  const DTO = await profileService.deleteCertificate(req.params.certificateId, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const quickStart = catchAsync(async (req, res) => {
  const { fullName, schoolName, major, workPlace, position } = req.body;
  try {
    const success = await axios.patch('/user', { fullName }, { headers: { Authorization: req.get('Authorization') } });
  } catch (error) {
    Response(res, httpStatus.UNAUTHORIZED, 'Invalid credential', null);
  }
  const DTO = await profileService.quickStart(fullName, schoolName, major, workPlace, position, req.user);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
});

const updateAvatar = catchAsync( async (req, res) => {
  const DTO = await profileService.updateAvatar(req.user, req.body.avatar);
  Response(res, DTO.statusCode, DTO.message, DTO.data);
})

module.exports = {
  editProfile,
  createSchool,
  updateSchool,
  deleteSchool,
  createExperience,
  updateExperience,
  deleteExperience,
  getProfile,
  getSocialById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSchoolById,
  createScientific,
  updateScientific,
  deleteScientific,
  getExperienceById,
  createContact,
  updateContact,
  deleteContact,
  getFollowList,
  quickStart,
  createReward,
  updateReward,
  deleteReward,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  updateAvatar,
};
