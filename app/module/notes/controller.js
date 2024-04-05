const service = require("./service");

async function createNote(req, res) {
  try {
    const { data, message } = await service.createNote(req.body);

    return res.status(200).json({ data, message });
  } catch (err) {
    const { message, httpStatusCode } = err;
    return res
      .status(err.httpStatusCode)
      .json({ httpStatusCode, error: message });
  }
}

module.exports = {
  createNote,
};
