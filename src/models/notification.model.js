const mongoose = require('mongoose');

const followNotification = new mongoose.Schema({
  isTrigger: {
    type: String,
    enum: ['accept', 'decline', 'pending'],
    default: 'pending',
  },
});

const notificationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: Number,
      required: true,
    },
    fromId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Profile',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    typeNoti: {
      type: String,
      enum: ['follow', 'accept-follow'],
      required: true,
    },
    followNotification: {
      isTrigger: {
        type: String,
        enum: ['accept', 'decline', 'pending'],
        default: 'pending',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
