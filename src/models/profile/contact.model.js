const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  contactType: {
    type: Number,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  viewPermission: {
    type: String,
    enum: ['protected', 'private', 'public'],
    default: 'public',
  },
});

/**
 * @typedef Contact
 */
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
