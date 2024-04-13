const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  subtaskTaskId: {
    type: String,
    required: false,
  },

  subtaskUserId: {
    type: String,
    required: false,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "IN PROGRESS",
    required: false,
  },

  budget: {
    type: Number,
    required: true,
  },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
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

const Subtask = mongoose.model("subtask", subtaskSchema);

module.exports = {
  Subtask,
};
