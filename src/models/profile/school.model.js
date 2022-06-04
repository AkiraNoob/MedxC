const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    // required: true,
  },
  major: {
    type: String,
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
 * @typedef School
 */
const School = mongoose.model('School', schoolSchema);
module.exports = School;
