const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const digitCodeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verify: [
      {
        digitCode: {
          type: String,
          required: true,
          index: true,
        },
        expires: {
          type: Date,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    blacklisted: {
      type: Boolean,
      default: false,
    },
    wrongTimes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
digitCodeSchema.plugin(toJSON);

/**
 * @typedef DigitCode
 */
const DigitCode = mongoose.model('DigitCode', digitCodeSchema);

module.exports = DigitCode;
