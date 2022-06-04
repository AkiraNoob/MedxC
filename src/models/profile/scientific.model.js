const mongoose = require('mongoose');

const scientificSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    required: true,
  },
  publisher: {
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
 * @typedef Scientific
 */
const Scientific = mongoose.model('Scientific', scientificSchema);
module.exports = Scientific;
