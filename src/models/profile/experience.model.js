const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  workPlace: {
    type: String,
    // required: true,
  },
  position: {
    type: String,
    // required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (endDate) {
        if (endDate) {
          let _endDate = +new Date(endDate);
          let _startDate = +new Date(this.startDate);

          return _endDate >= _startDate;
        } else {
          return true;
        }
      },
      message: 'endDate must equal or greater than startDate',
    },
  },
  viewPermission: {
    type: String,
    enum: ['protected', 'private', 'public'],
    default: 'public',
  },
});

/**
 * @typedef Experience
 */
const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
