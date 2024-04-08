const jwt = require("jsonwebtoken");
const { Note } = require("./note");

const secretKey = process.env.JWT_SECRET;

const createNote = async (req, res) => {
  console.log("==== Creating Note ====");

  const token = req.headers.authorization.split(" ")[1];

  const { id } = jwt.verify(token, secretKey);

  try {
    const { notetitle, notebody } = req.body;

    const note = new Note({
      notetitle,
      notebody,
      noteuid: id,
    });

    await note.save();

    return {
      data: note,
      message: `Note Created Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

const deleteNote = async (req, res) => {
  console.log("==== Deleting Note ====");
  const token = req.headers.authorization.split(" ")[1];

  const { id } = jwt.verify(token, secretKey);

  try {
    const { noteid } = req.params;
    const filter = { _id: noteid, noteuid: id };

    const response = await Note.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        response,
        message: `Note Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Note ID ${noteid} does not exist.`,
      };
    }
  } catch (err) {
    throw err;
  }
};

const listNotes = async (req, res) => {
  console.log("==== List Notes ====");

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const notes = await Note.find().skip(skip).limit(pageSize);

    const totalNotes = await Note.countDocuments();
    const totalPages = Math.ceil(totalNotes / pageSize);

    res.status(200).json({
      notes,
      totalPages,
      currentPage: page,
      pageSize,
      totalNotes,
      message: `Notes Listed successfully`,
    });
  } catch (error) {
    console.error("Error listing notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editNote = async (req, res) => {
  console.log("==== Editting Note ====");
  const token = req.headers.authorization.split(" ")[1];

  const { id } = jwt.verify(token, secretKey);

  try {
    const { noteid } = req.params;
    const filter = { _id: noteid, noteuid: id };

    const note = await Note.findOne(filter);
    if (!note) {
      return {
        message: `${noteid} does not exist`,
      };
    } else {
      const { notetitle, notebody } = req.body;
      Object.assign(note, { notetitle, notebody });

      await note.save();

      return {
        note,
        message: `Note updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNote,
  deleteNote,
  listNotes,
  editNote,
};
