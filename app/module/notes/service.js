const bcrypt = require("bcrypt");
const { Note } = require("./note");
const jwt = require("jsonwebtoken");

const createNote = async (body) => {
  try {
    const { noteTitle, noteBody } = body;

    let newNote = new Note();
    newNote.title = noteTitle.trim();
    newNote.body = noteBody.trim();

    await newNote.save();

    return {
      data: newNote,
      message: `Note Created Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createNote,
};
