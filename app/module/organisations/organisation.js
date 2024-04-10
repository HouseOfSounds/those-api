const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema({
  organisationUserId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Organisation = mongoose.model("organisation", organisationSchema);

module.exports = {
  Organisation,
};
