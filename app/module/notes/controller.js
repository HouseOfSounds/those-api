const service = require("./service");

async function createNote(req, res) {
  try {
    const response = await service.createNote(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteNote(req, res) {
  try {
    const response = await service.deleteNote(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listNotes(req, res) {
  try {
    const response = await service.listNotes(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editNote(req, res) {
  try {
    const response = await service.editNote(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createNote,
  deleteNote,
  listNotes,
  editNote,
};
