const service = require("./service");

async function createInvite(req, res) {
  try {
    const response = await service.createInvite(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteInvite(req, res) {
  try {
    const response = await service.deleteInvite(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listInvites(req, res) {
  try {
    const response = await service.listInvites(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editInvite(req, res) {
  try {
    const response = await service.editInvite(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createInvite,
  deleteInvite,
  listInvites,
  editInvite,
};
