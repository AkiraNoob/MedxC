const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  rewardName: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  grantDate: {
    type: Date,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  viewPermission: {
    type: String,
    enum: ['protected', 'private', 'public'],
    default: 'public',
  },
});

/**
 * @typedef Reward
 */
const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
