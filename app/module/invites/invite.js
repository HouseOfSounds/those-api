const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  inviteUserId: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    default: "IN PROGRESS",
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    required: false,
  },

  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Invite = mongoose.model("invite", inviteSchema);

module.exports = {
  Invite,
};
