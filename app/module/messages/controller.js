const service = require("./service");

async function createMessage(req, res) {
  try {
    const response = await service.createMessage(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteMessage(req, res) {
  try {
    const response = await service.deleteMessage(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listMessages(req, res) {
  try {
    const response = await service.listMessages(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editMessage(req, res) {
  try {
    const response = await service.editMessage(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createMessage,
  deleteMessage,
  listMessages,
  editMessage,
};
