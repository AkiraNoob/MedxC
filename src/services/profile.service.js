const httpStatus = require('http-status');
const { Profile, Experience, Reward, Scientific, Social, School, Contact, Certificate } = require('../models/profile');
const { axios } = require('../config/axios');
const ApiError = require('../utils/ApiError');
const { socialMediaGetNum } = require('../enum/socialmedia.enum');
const { contactGetNum } = require('../enum/contact.enum');

const { verifyToken } = require('../utils/jwt');

const getFollowList = async (req) => {
  try {
    const { userId } = req.query;

    let hiddenColumn = {
      qbankData: 0,
      experience: 0,
      school: 0,
      reward: 0,
      scientific: 0,
      notificationCount: 0,
      _id: 0,
      ownerId: 0,
      bio: 0,
      social: 0,
      __v: 0,
    };

    let result = (
      await Profile.find(
        {
          ownerId: userId,
        },
        hiddenColumn
      ).populate([{ path: 'followers.profileId' }, { path: 'isFollowedBy.profileId' }])
    )[0];

    let filterFollower = result.followers.filter((follow) => follow.isAccepted === true);
    let filterIsFollowedBy = result.isFollowedBy.filter((isFollowedBy) => isFollowedBy.isAccepted === true);

    return {
      folowers: filterFollower,
      isFollowedBy: filterIsFollowedBy,
    };
  } catch (err) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const filterViewPermission = async (viewerId, profileOwnerId) => {
  //viewer is owner
  if (viewerId === parseInt(profileOwnerId)) {
    return {
      viewPermission: 'owner',
      filter: ['public', 'protected', 'private'],
    };
  }

  let isFollower = await Profile.find({
    ownerId: viewerId,
    'followers.userId': { $eq: profileOwnerId },
  });

  //viewer is follower
  if (isFollower.length > 0) {
    //but is not accepted
    if (!isFollower[0].followers[0].isAccepted) {
      return {
        viewPermission: 'follower',
        filter: ['public'],
        isAccepted: false,
      };
    }

    //otherwise
    return {
      viewPermission: 'follower',
      filter: ['public', 'protected'],
      isAccepted: true,
    };
  }

  //viewer is guest
  return {
    viewPermission: 'guest',
    filter: ['public'],
  };
};

const getProfile = async (req) => {
  try {
    const {
      query, //profile owner
      params: { userId },
    } = req;

    let viewerId = null;
    let pendingFollowMe = false;

    try {
      let { sub } = await verifyToken(query.accessToken);
      viewerId = sub;
    } catch (err) {
      console.log(err);
    }

    let { viewPermission, filter, isAccepted } = await filterViewPermission(viewerId?.id, userId);

    const profile = await Profile.find({
      ownerId: userId,
    }).populate([
      { path: 'social', match: { viewPermission: { $in: filter } } },
      { path: 'experience', match: { viewPermission: { $in: filter } } },
      { path: 'school', match: { viewPermission: { $in: filter } } },
      { path: 'reward', match: { viewPermission: { $in: filter } } },
      { path: 'scientific', match: { viewPermission: { $in: filter } } },
      { path: 'contact', match: { viewPermission: { $in: filter } } },
      { path: 'certificate', match: { viewPermission: { $in: filter } } },
    ]);

    let filterFollower = profile[0].followers.filter((follow) => {
      if (follow.userId === viewerId?.id && !follow.isAccepted) {
        pendingFollowMe = true;
      }
      return follow.isAccepted === true;
    });
    let filterIsFollowedBy = profile[0].isFollowedBy.filter((isFollowedBy) => {
      // console.log(userId, isFollowedBy.userId, isFollowedBy.isAccepted, viewerId);

      return isFollowedBy.isAccepted === true;
    });

    profile[0].followers = filterFollower;
    profile[0].isFollowedBy = filterIsFollowedBy;
    profile[0].pendingFollowMe = pendingFollowMe;

    // console.log(profile[0]);

    if (profile.length <= 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'PROFILE_NOT_FOUND');
    }

    return {
      statusCode: httpStatus.OK,
      data: {
        viewPermission,
        isAccepted,
        profiles: profile[0],
      },
    };
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const getSocialById = async (req) => {
  try {
    let { user, params } = req;

    let socialLink = await Profile.find({
      ownerId: user.id,
    }).populate({ path: 'social', match: { _id: { $eq: params.socialLinkId } } });

    if (socialLink[0].social.length <= 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Owner does not have this social link');
    }

    return {
      statusCode: httpStatus.CREATED,
      data: {
        socialLink: socialLink[0] ? socialLink[0].social[0] : null,
      },
    };
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

/**
 *
 * @param {Object} req
 * @returns
 */
const createSocialLink = async (req) => {
  try {
    let {
      body: { link, socialNetwork, viewPermission },
    } = req;

    let indexOfSocialMedia = socialMediaGetNum.indexOf(socialNetwork);

    if (indexOfSocialMedia < 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cannot find this social media');
    }

    let newSocialLink = new Social({ link, socialNetwork: indexOfSocialMedia, viewPermission });

    //add to profile model
    let profile = await Profile.findOneAndUpdate(
      {
        ownerId: req.user.id,
      },
      {
        $push: { social: newSocialLink._id },
      }
    );

    if (profile) {
      await newSocialLink.save();
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
    }

    return {
      statusCode: httpStatus.CREATED,
      message: 'Create social link success',
      data: {
        ownerId: profile.ownerId,
        socialLinkId: newSocialLink._id,
      },
    };
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

/**
 *
 * @param {Object} req
 * @returns
 */
const updateSocialLink = async (req) => {
  try {
    const { body, user, params } = req;

    let profile = await Profile.findOne({ ownerId: user.id }).populate('social');

    if (profile) {
      let matchSocialLink = profile.social.filter((social) => {
        return social._id.equals(`${params.socialLinkId}`);
      });

      if (matchSocialLink.length > 0) {
        const { link, socialNetwork, viewPermission } = body;

        let socialLink = matchSocialLink[0];

        if (link) {
          socialLink.link = link;
        }

        if (socialNetwork) {
          let indexOfSocialMedia = socialMediaGetNum.indexOf(socialNetwork);

          socialLink.socialNetwork = indexOfSocialMedia;
        }

        if (viewPermission) {
          socialLink.viewPermission = viewPermission;
        }

        await socialLink.save();
      }
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
    }

    return {
      statusCode: httpStatus.OK,
      message: 'Update social link',
    };
  } catch (error) {
    console.log(error);

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

/**
 *
 * @param {Object} req
 * @returns
 */
const deleteSocialLink = async (req) => {
  try {
    const {
      user,
      params: { socialLinkId },
    } = req;

    if (!socialLinkId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'param socialLinkId is required');
    }

    if (typeof socialLinkId !== typeof 'string') {
      throw new ApiError(httpStatus.FORBIDDEN, 'param socialLinkId must be a string');
    }

    let profile = await Profile.updateOne(
      {
        ownerId: user.id,
      },
      {
        $pull: { social: socialLinkId },
      }
    );

    if (profile.nModified > 0) {
      await Social.deleteOne({
        _id: socialLinkId,
      });
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
    }

    return {
      statusCode: httpStatus.OK,
      message: 'Delete social link successful',
    };
  } catch (error) {
    console.log(error);

    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

/**
 * edit profile
 * @param {*} body
 * @param {*} user
 * @returns {Number}
 */
const editProfile = async (body, user) => {
  const { bio } = body;
  const ownerId = user.id;
  if (bio !== undefined) {
    await Profile.findOneAndUpdate({ ownerId }, { bio: bio }, { upsert: true });
    return 200;
  }
};

/**
 * create education profile
 * @param {*} body
 * @param {*} user
 * @returns {Number} status
 */
const createSchool = async (body, user) => {
  const { schoolName, major, startDate, endDate, viewPermission } = body;
  const ownerId = user.id;
  const school = await School.create({ schoolName, major, startDate, endDate, viewPermission });
  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { school: school } });
  if (profile) {
    return 201;
  }
};

/**
 * update education profile
 * @param {*} body
 * @param {*} user
 * @param {*} schoolId
 * @returns {Number} status
 */
const updateSchool = async (body, user, schoolId) => {
  const { schoolName, major, startDate, endDate, viewPermission } = body;
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, school: { $elemMatch: { $eq: schoolId } } });
  if (profile) {
    const school = await School.findById(schoolId);
    const update = {};
    if (schoolName) {
      update.schoolName = schoolName;
    }
    if (major) {
      update.major = major;
    }
    if (startDate !== undefined) {
      if (endDate !== undefined) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          return 403;
        }
      } else if (Date.parse(school.endDate) < Date.parse(startDate)) {
        return 403;
      }
      update.startDate = startDate;
    }
    if (endDate !== undefined) {
      if (startDate !== undefined) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          return 403;
        }
      } else if (Date.parse(endDate) < Date.parse(school.startDate)) {
        return 403;
      }
      update.endDate = endDate;
    }
    if (viewPermission) {
      update.viewPermission = viewPermission;
    }
    await School.updateOne({ _id: schoolId }, update);
    return 200;
  } else {
    return 404;
  }
};

/**
 * delete education profile
 * @param {*} user
 * @param {*} schoolId
 * @returns {Number} status
 */
const deleteSchool = async (user, schoolId) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, school: { $elemMatch: { $eq: schoolId } } });

  if (profile) {
    await Profile.updateOne({ ownerId }, { $pull: { school: { $eq: schoolId } } });
    await School.deleteOne({ _id: schoolId });
    return 200;
  } else {
    return 404;
  }
};

/**
 * Create a new reward
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Reward>}
 */
const createReward = async (body, user) => {
  const { rewardName, organization, link, grantDate, description, viewPermission } = body;

  // format grantDate
  let formatGrantDate;
  if (grantDate) formatGrantDate = formatDate(new Date(grantDate));

  const ownerId = user.id;
  const reward = await Reward.create({ rewardName, organization, grantDate, link, description, viewPermission });

  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { reward: reward._id } });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  return {
    statusCode: httpStatus.CREATED,
    message: 'Reward created successfully',
    data: {
      rewardId: reward._id,
      rewardName: reward.rewardName,
      organization: reward.organization,
      grantDate: formatGrantDate,
      link: reward.link,
      description: reward.description,
      viewPermission: reward.viewPermission,
    },
  };
};

/**
 * Update Reward by id
 * @param {ObjectId} rewardId
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Reward>}
 */

const updateReward = async (rewardId, body, user) => {
  const { rewardName, organization, grantDate, link, description, viewPermission } = body;
  const ownerId = user.id;

  const profile = await Profile.findOne({ ownerId, reward: { $elemMatch: { $eq: rewardId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }

  // Only update the value we passed in the request
  const update = {};

  if (rewardName) {
    update.rewardName = rewardName;
  }
  if (organization) {
    update.organization = organization;
  }
  if (link !== undefined) {
    update.link = link;
  }

  if (grantDate !== undefined) {
    update.grantDate = grantDate;
  }

  if (description !== undefined) {
    update.description = description;
  }
  if (viewPermission) {
    update.viewPermission = viewPermission;
  }
  const reward = await Reward.findByIdAndUpdate({ _id: rewardId }, update, { new: true });

  let formatGrantDate;
  if (reward.grantDate) {
    formatGrantDate = formatDate(new Date(reward.grantDate));
  }

  if (!reward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reward not found with that ID');
  }

  return {
    statusCode: httpStatus.OK,
    message: 'Reward updated scuccessfully',
    data: {
      rewardId: reward._id,
      rewardName: reward.rewardName,
      organization: reward.organization,
      grantDate: formatGrantDate,
      link: reward.link,
      description: reward.description,
      viewPermission: reward.viewPermission,
    },
  };
};

/**
 * Delete Reward by id
 * @param {ObjectId} rewardId
 * @param {Object} user
 * @returns {Promise<Reward>}
 */

const deleteReward = async (rewardId, user) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, reward: { $elemMatch: { $eq: rewardId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  await Profile.updateOne({ ownerId }, { $pull: { reward: { $eq: rewardId } } });

  const reward = await Reward.findById(rewardId);

  if (!reward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reward not found with that ID');
  }
  await Reward.deleteOne({ _id: rewardId });

  return {
    statusCode: httpStatus.NO_CONTENT,
    message: 'Reward deleted successfully',
    data: null,
  };
};

/**
 * create experience
 * @param {*} body
 * @param {*} user
 * @returns {Number} status
 */
const createExperience = async (body, user) => {
  const { workPlace, position, startDate, endDate, viewPermission } = body;
  const ownerId = user.id;
  const experience = new Experience({ workPlace, position, startDate, endDate, viewPermission });
  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { experience: experience } });
  if (profile) {
    await experience.save();
    return 201;
  } else {
    return 404;
  }
};

/**
 * update experience profile
 * @param {*} body
 * @param {*} user
 * @param {*} experienceId
 * @returns {Number} status
 */
const updateExperience = async (body, user, experienceId) => {
  const { workPlace, position, startDate, endDate, viewPermission } = body;
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, experience: { $elemMatch: { $eq: experienceId } } });
  if (profile) {
    const experience = await Experience.findById(experienceId);
    const update = {};
    if (workPlace) {
      update.workPlace = workPlace;
    }
    if (position) {
      update.position = position;
    }
    if (startDate !== undefined) {
      if (endDate !== undefined) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          return 403;
        }
      } else if (Date.parse(experience.endDate) < Date.parse(startDate)) {
        return 403;
      }
      update.startDate = startDate;
    }
    if (endDate !== undefined) {
      if (startDate !== undefined) {
        if (Date.parse(endDate) < Date.parse(startDate)) {
          return 403;
        }
      } else if (Date.parse(endDate) < Date.parse(experience.startDate)) {
        return 403;
      }
      update.endDate = endDate;
    }
    if (viewPermission) {
      update.viewPermission = viewPermission;
    }
    await Experience.updateOne({ _id: experienceId }, update);
    return 200;
  } else {
    return 404;
  }
};

/**
 * delete experience profile
 * @param {*} user
 * @param {*} experienceId
 * @returns {Number} status
 */
const deleteExperience = async (user, experienceId) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, experience: { $elemMatch: { $eq: experienceId } } });

  if (profile) {
    await Profile.updateOne({ ownerId }, { $pull: { experience: { $eq: experienceId } } });
    await Experience.deleteOne({ _id: experienceId });
    return 200;
  } else {
    return 404;
  }
};

/**
 * get school by id
 * @param {*} user
 * @param {*} schoolId
 * @returns {Number} status
 */
const getSchoolById = async (user, schoolId) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, school: { $elemMatch: { $eq: schoolId } } });
  if (profile) {
    const school = await School.findById(schoolId);
    return { statusCode: 200, message: 'success', data: school };
  } else {
    return { statusCode: 404, message: 'not found', data: null };
  }
};
/**
 * get experience by id
 * @param {*} user
 * @param {*} experienceId
 * @returns {Number} status
 */
const getExperienceById = async (user, experienceId) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, experience: { $elemMatch: { $eq: experienceId } } });
  if (profile) {
    const experience = await Experience.findById(experienceId);
    return { statusCode: 200, message: 'success', data: experience };
  } else {
    return { statusCode: 404, message: 'not found', data: null };
  }
};

// Format Date 'DD/MM/YYYY'
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/');
}

/**
 * Create a new Scientific
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Scientific>}
 */
const createScientific = async (body, user) => {
  const { scientificName, publisher, link, grantDate, description, viewPermission } = body;

  // format grantDate
  let formatGrantDate;
  if (grantDate) formatGrantDate = formatDate(new Date(grantDate));

  const ownerId = user.id;
  const scientific = await Scientific.create({ scientificName, publisher, grantDate, link, description, viewPermission });

  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { scientific: scientific._id } });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  return {
    statusCode: httpStatus.CREATED,
    message: 'Scientific created successfully',
    data: {
      scientificId: scientific._id,
      scientificName: scientific.scientificName,
      publisher: scientific.publisher,
      grantDate: formatGrantDate,
      link: scientific.link,
      description: scientific.description,
      viewPermission: scientific.viewPermission,
    },
  };
};

/**
 * Update Scientific by id
 * @param {ObjectId} scientificId
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Scientific>}
 */

const updateScientific = async (scientificId, body, user) => {
  const { scientificName, publisher, grantDate, link, description, viewPermission } = body;
  const ownerId = user.id;

  const profile = await Profile.findOne({ ownerId, scientific: { $elemMatch: { $eq: scientificId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }

  // Only update the value we passed in the request
  const update = {};

  if (scientificName) {
    update.scientificName = scientificName;
  }
  if (publisher) {
    update.publisher = publisher;
  }
  if (grantDate !== undefined) {
    update.grantDate = grantDate;
  }
  if (link !== undefined) {
    update.link = link;
  }
  if (description !== undefined) {
    update.description = description;
  }
  if (viewPermission) {
    update.viewPermission = viewPermission;
  }

  const scientific = await Scientific.findByIdAndUpdate({ _id: scientificId }, update, { new: true });

  let formatGrantDate;
  if (scientific.grantDate) {
    formatGrantDate = formatDate(new Date(scientific.grantDate));
  }

  if (!scientific) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Scientific not found with that ID');
  }

  return {
    statusCode: httpStatus.OK,
    message: 'Scientific updated scuccessfully',
    data: {
      scientificId: scientific._id,
      scientificName: scientific.scientificName,
      publisher: scientific.publisher,
      grantDate: formatGrantDate,
      link: scientific.link,
      description: scientific.description,
      viewPermission: scientific.viewPermission,
    },
  };
};

/**
 * Delete Scientific by id
 * @param {ObjectId} scientificId
 * @param {Object} user
 * @returns {Promise<Scientific>}
 */

const deleteScientific = async (scientificId, user) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, scientific: { $elemMatch: { $eq: scientificId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  await Profile.updateOne({ ownerId }, { $pull: { scientific: { $eq: scientificId } } });

  const scientific = await Scientific.findById(scientificId);

  if (!scientific) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Scientific not found with that ID');
  }
  await scientific.deleteOne({ _id: scientificId });

  return {
    statusCode: httpStatus.NO_CONTENT,
    message: 'Scientific deleted successfully',
    data: null,
  };
};

/**
 * Create a new Contact
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Contact>}
 */

const createContact = async (body, user) => {
  const { contactType, contactInfo, viewPermission } = body;
  const ownerId = user.id;

  const indexOfContact = contactGetNum.indexOf(contactType);

  if (indexOfContact < 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot find this contact');
  }

  const contact = await Contact.create({ contactType: indexOfContact, contactInfo, viewPermission });

  //add to profile model
  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { contact: contact._id } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  ////////////////////////////////

  return {
    statusCode: httpStatus.CREATED,
    message: 'Contact created successfully',
    data: {
      ownerId,
      contact,
    },
  };
};

/**
 * Update a Contact
 * @param {ObjectId} contactId
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Contact>}
 */

const updateContact = async (contactId, body, user) => {
  const { contactType, contactInfo, viewPermission } = body;
  const ownerId = user.id;

  const profile = await Profile.findOne({ ownerId, contact: { $elemMatch: { $eq: contactId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  // Only update the value we passed in the request
  const update = {};

  if (contactType) {
    const indexOfContact = contactGetNum.indexOf(contactType);

    update.contactType = indexOfContact;
  }

  if (contactInfo) {
    update.contactInfo = contactInfo;
  }

  if (viewPermission) {
    update.viewPermission = viewPermission;
  }

  const contact = await Contact.findByIdAndUpdate({ _id: contactId }, update, { new: true });

  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found with that ID');
  }

  return {
    statusCode: httpStatus.OK,
    message: 'Update social link',
    data: {
      ownerId,
      contact,
    },
  };
};

/**
 * Delete Contact by id
 * @param {ObjectId} contactId
 * @param {Object} user
 * @returns {Promise<Scientific>}
 */

const deleteContact = async (contactId, user) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, contact: { $elemMatch: { $eq: contactId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  await Profile.updateOne({ ownerId }, { $pull: { contact: { $eq: contactId } } });

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found with that ID');
  }
  await Contact.deleteOne({ _id: contactId });

  return {
    statusCode: httpStatus.NO_CONTENT,
    message: 'Contact deleted successfully',
    data: null,
  };
};

/**
 * Create a new certificate
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Certificate>}
 */
const createCertificate = async (body, user) => {
  const { certificateName, organization, link, grantDate, description, viewPermission } = body;

  // format grantDate
  let formatGrantDate;
  if (grantDate) formatGrantDate = formatDate(new Date(grantDate));

  const ownerId = user.id;
  const certificate = await Certificate.create({
    certificateName,
    organization,
    grantDate,
    link,
    description,
    viewPermission,
  });

  const profile = await Profile.findOneAndUpdate({ ownerId }, { $push: { certificate: certificate._id } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }

  return {
    statusCode: httpStatus.CREATED,
    message: 'certificate created successfully',
    data: {
      certificateId: certificate._id,
      certificateName: certificate.certificateName,
      organization: certificate.organization,
      grantDate: formatGrantDate,
      link: certificate.link,
      description: certificate.description,
      viewPermission: certificate.viewPermission,
    },
  };
};

/**
 * Update certificate by id
 * @param {ObjectId} certificateId
 * @param {Object} body
 * @param {Object} user
 * @returns {Promise<Certificate>}
 */

const updateCertificate = async (certificateId, body, user) => {
  const { certificateName, organization, grantDate, link, description, viewPermission } = body;
  const ownerId = user.id;

  const profile = await Profile.findOne({ ownerId, certificate: { $elemMatch: { $eq: certificateId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }

  // Only update the value we passed in the request
  const update = {};

  if (certificateName) {
    update.certificateName = certificateName;
  }
  if (organization) {
    update.organization = organization;
  }
  if (link !== undefined) {
    update.link = link;
  }

  if (grantDate !== undefined) {
    update.grantDate = grantDate;
  }

  if (description !== undefined) {
    update.description = description;
  }
  if (viewPermission) {
    update.viewPermission = viewPermission;
  }
  const certificate = await Certificate.findByIdAndUpdate({ _id: certificateId }, update, { new: true });

  let formatGrantDate;
  if (certificate.grantDate) {
    formatGrantDate = formatDate(new Date(certificate.grantDate));
  }

  if (!certificate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'certificate not found with that ID');
  }

  return {
    statusCode: httpStatus.OK,
    message: 'certificate updated scuccessfully',
    data: {
      certificateId: certificate._id,
      certificateName: certificate.certificateName,
      organization: certificate.organization,
      grantDate: formatGrantDate,
      link: certificate.link,
      description: certificate.description,
      viewPermission: certificate.viewPermission,
    },
  };
};

/**
 * Delete certificate by id
 * @param {ObjectId} certificateId
 * @param {Object} user
 * @returns {Promise<certificate>}
 */

const deleteCertificate = async (certificateId, user) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId, certificate: { $elemMatch: { $eq: certificateId } } });

  if (!profile) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not owner of this profile. No access right', false);
  }
  await Profile.updateOne({ ownerId }, { $pull: { certificate: { $eq: certificateId } } });

  const certificate = await Certificate.findById(certificateId);

  if (!certificate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'certificate not found with that ID');
  }
  await certificate.deleteOne({ _id: certificateId });

  return {
    statusCode: httpStatus.NO_CONTENT,
    message: 'certificate deleted successfully',
    data: null,
  };
};

/**
 * quick create profile
 * @param {String} fullName
 * @param {String} schoolName
 * @param {String} major
 * @param {String} workPlace
 * @param {String} position
 * @param {Object} user
 * @returns {Object}
 */
const quickStart = async (fullName, schoolName, major, workPlace, position, user) => {
  const ownerId = user.id;
  const profile = await Profile.findOne({ ownerId });

  if (profile) {
    await Profile.findOneAndUpdate({ ownerId }, { 'qbankData.fullName': fullName, quickStartSkipped: true });
    if (schoolName || major) {
      const school = await School.create({ schoolName, major });
      await Profile.findOneAndUpdate({ ownerId }, { $push: { school: school } });
    }
    if (workPlace || position) {
      const experience = await Experience.create({ workPlace, position });
      await Profile.findOneAndUpdate({ ownerId }, { $push: { experience: experience } });
    }
    return {
      statusCode: httpStatus.CREATED,
      message: 'success',
      data: null,
    };
  } else {
    return {
      statusCode: httpStatus.NOT_FOUND,
      message: 'profile not found',
      data: null,
    };
  }
};

const updateAvatar = async (user, avatar) => {
  const ownerId = user.id;
  const profile = await Profile.findOneAndUpdate({ ownerId }, { avatar: avatar });
  return {
    statusCode: httpStatus.OK,
    message: 'success',
    data: null,
  };
};

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
