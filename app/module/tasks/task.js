const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskProjectId: {
    type: String,
    required: false,
  },

  taskUserId: {
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
    required: false,
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

const Task = mongoose.model("task", taskSchema);

module.exports = {
  Task,
};
