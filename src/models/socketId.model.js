const mongoose = require('mongoose');

/**
 * Socket room structure
 * {
 *  <String> roomId,
 * <String> roomName
 * }
 */

const socketRoomIdSchema = new mongoose.Schema(
  {
    ownerId: {
      type: Number,
      required: true,
    },
    // socketId: {
    //   type: String,
    //   required: true,
    // },
    roomId: {
      type: String,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Notification
 */
const SocketRoom = mongoose.model('SocketRoom', socketRoomIdSchema);
module.exports = SocketRoom;
