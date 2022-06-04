const { boolean } = require('joi');
const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    userId: {
      type: Number,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

//-----------PROFILE SCHEMA-----------//

const profileSchema = new mongoose.Schema({
  ownerId: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    trim: true,
    default: ' ',
  },
  avatar: {
    type: String,
  },
  quickStartSkipped: { type: Boolean, default: false },
  experience: [{ type: mongoose.Types.ObjectId, ref: 'Experience' }],
  school: [{ type: mongoose.Types.ObjectId, ref: 'School' }],
  reward: [{ type: mongoose.Types.ObjectId, ref: 'Reward' }],
  scientific: [{ type: mongoose.Types.ObjectId, ref: 'Scientific' }],
  social: [{ type: mongoose.Types.ObjectId, ref: 'Social' }],
  contact: [{ type: mongoose.Types.ObjectId, ref: 'Contact' }],
  certificate: [{ type: mongoose.Types.ObjectId, ref: 'Certificate' }],
  followers: [followSchema],
  isFollowedBy: [followSchema],
  pendingFollowMe: {
    type: Boolean,
  },
  notificationCount: {
    type: Number,
    default: 0,
  },
  qbankData: {
    stdId: {
      type: String,
    },
    fullName: {
      type: String,
    },
    major: {
      type: String,
    },
    school: {
      type: String,
    },
    email: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    isNewUser: {
      type: Boolean,
    },
    isVerify: {
      type: Boolean,
    },
    digitInputTimes: {
      type: Number,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
  },
});

/**
 * @typedef Profile
 */
const Profile = mongoose.model('Profile', profileSchema);
// const Follower = mongoose.model('Followers', followerSchema);
module.exports = Profile;
