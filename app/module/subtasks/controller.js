const service = require("./service");

async function createSubtask(req, res) {
  try {
    const response = await service.createSubtask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteSubtask(req, res) {
  try {
    const response = await service.deleteSubtask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listSubtasks(req, res) {
  try {
    const response = await service.listSubtasks(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editSubtask(req, res) {
  try {
    const response = await service.editSubtask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createSubtask,
  deleteSubtask,
  listSubtasks,
  editSubtask,
};
