const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateName: {
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
 * @typedef Certificate
 */
const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
