const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
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

const Note = mongoose.model("note", noteSchema);

module.exports = {
  Note,
};
