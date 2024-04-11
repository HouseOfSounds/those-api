const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectUserId: {
    type: String,
    required: true,
  },

  organisationId: {
    type: String,
    required: false,
  },

  name: {
    type: String,
    required: true,
  },

  artist: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  budget: {
    type: Number,
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

const Project = mongoose.model("project", projectSchema);

module.exports = {
  Project,
};
