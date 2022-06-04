const { Profile, Experience, Reward, Scientific, Social, School } = require('../models/profile');
const { axios } = require('../config/axios');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const someOneFollowYou = async ({ followerId, ownerId }) => {
  try {
    //Owner cannot follow owner
    if (followerId !== ownerId) {
      let ownerUser = await Profile.find({ ownerId }); // 0-
      let receiveFollowRequestUser = await Profile.find({ ownerId: followerId }).populate({
        path: 'isFollowedBy',
      });

      if (!ownerUser[0]) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cannot found this profile owner');
      }

      if (ownerUser[0].followers.find((user) => user.userId == ownerId)) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Already follow this profile owner');
      }

      if (!receiveFollowRequestUser[0]) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Cannot found this follower');
      }

      //both owner and follwer is valid
      if (!ownerUser[0].followers.find((user) => user.userId == followerId)) {
        ownerUser[0].followers.push({
          profileId: receiveFollowRequestUser[0]['_id'],
          userId: receiveFollowRequestUser[0]['ownerId'],
        });
      }

      if (!receiveFollowRequestUser[0].isFollowedBy.find((user) => user.userId == ownerId)) {
        receiveFollowRequestUser[0].isFollowedBy.push({
          profileId: ownerUser[0]['_id'],
          userId: ownerUser[0]['ownerId'],
        });
      }

      await ownerUser[0].save();
      await receiveFollowRequestUser[0].save();

      return {
        receiveFollowRequestUser: receiveFollowRequestUser[0],
        ownerUser: ownerUser[0],
      };
    }

    throw new ApiError(httpStatus.BAD_REQUEST, 'Owner cannot follow owner');
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const acceptFollow = async ({ followerId, ownerId, isAccepted }) => {
  try {
    if (isAccepted) {
      let res = await Promise.all([
        Profile.find({ ownerId }).populate({
          path: 'isFollowedBy',
        }),
        Profile.find({ ownerId: followerId }).populate({
          path: 'followers',
        }),
      ]);

      let getFollowRequestUser = res[0];
      let requestFollowUser = res[1];

      if (!getFollowRequestUser[0].isFollowedBy.find((user) => user.userId == followerId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `User ${followerId} is not follow you`);
      }

      getFollowRequestUser[0].isFollowedBy.forEach((user) => {
        if (user.userId == followerId) {
          user.isAccepted = isAccepted;
        }
      });

      requestFollowUser[0].followers.forEach((user) => {
        if (user.userId == ownerId) {
          user.isAccepted = isAccepted;
        }
      });

      await requestFollowUser[0].save();
      await getFollowRequestUser[0].save();

      return {
        requestFollowUser: requestFollowUser[0],
        getFollowRequestUser: getFollowRequestUser[0],
      };
    }
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const unfollow = async (req) => {
  try {
    const {
      user: { id: ownerId },
      body: { unfollowUserId },
    } = req;

    //Need to get followers of profile owner
    let ownerUser = await Profile.findOne({
      ownerId: ownerId,
    });

    let getFollowers = ownerUser.followers.find((follower) => follower.userId == unfollowUserId);

    if (!getFollowers) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You currently not follow this user.');
    }

    //Pull out followers and isFollowedBy
    await Profile.findOneAndUpdate(
      {
        ownerId: ownerId,
      },
      {
        $pull: {
          followers: {
            userId: unfollowUserId,
            isAccepted: true,
          },
        },
      }
    );

    await Profile.findOneAndUpdate(
      {
        ownerId: unfollowUserId,
      },
      {
        $pull: {
          isFollowedBy: {
            userId: ownerId,
            isAccepted: true,
          },
        },
      }
    );
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const remove = async (req) => {
  try {
    const {
      user: { id: ownerId },
      body: { removedUserId },
    } = req;

    //Need to get isFollowedBy of profile owner
    let ownerUser = await Profile.findOne({
      ownerId: ownerId,
    });

    let getIsFollowedBy = ownerUser.isFollowedBy.find((isFollowedBy) => isFollowedBy.userId == removedUserId);

    if (!getIsFollowedBy) {
      throw new ApiError(httpStatus.NOT_FOUND, 'This user currently is not followed you');
    }

    //Pull out followers and isFollowedBy
    await Profile.findOneAndUpdate(
      {
        ownerId,
      },
      {
        $pull: {
          isFollowedBy: {
            userId: removedUserId,
            isAccepted: true,
          },
        },
      }
    );
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

const cancel = async (req) => {
  try {
    const {
      user: { id: ownerId },
      body: { cancelUserId },
    } = req;

    //Need to get followers of profile owner
    let ownerUser = await Profile.findOne({
      ownerId: ownerId,
    });

    let cancelUser = await Profile.findOne({
      ownerId: cancelUserId,
    });

    const getFollowers = ownerUser.followers.find((follower) => follower.userId == cancelUserId);

    if (!getFollowers) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You is not follow this user.');
    }

    //Pull out followers and follower
    await Profile.findOneAndUpdate(
      {
        ownerId,
      },
      {
        $pull: {
          followers: {
            userId: cancelUserId,
            isAccepted: false,
          },
        },
      }
    );

    await Profile.findOneAndUpdate(
      {
        ownerId: cancelUserId,
      },
      {
        $pull: {
          isFollowedBy: {
            userId: ownerId,
            isAccepted: false,
          },
        },
      }
    );
  } catch (error) {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;

    if (error.statusCode) {
      statusCode = error.statusCode;
    }

    throw new ApiError(statusCode, error.message);
  }
};

module.exports = { someOneFollowYou, acceptFollow, unfollow, remove, cancel };
