const mongoose = require('mongoose');
const { socialMediaGetNum } = require('../../enum/socialmedia.enum');

const socialSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  socialNetwork: {
    type: Number,
    required: true,
  },
  viewPermission: {
    type: String,
    enum: ['protected', 'private', 'public'],
    default: 'public',
  },
});

/**
 * @typedef Social
 */
const Social = mongoose.model('Social', socialSchema);
module.exports = Social;
