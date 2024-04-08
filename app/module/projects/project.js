const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectuid: {
    type: String,
    required: true,
  },

  title: {
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

const Project = mongoose.model("project", noteSchema);

module.exports = {
  Project,
};
