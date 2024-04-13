const service = require("./service");

async function createTask(req, res) {
  try {
    const response = await service.createTask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteTask(req, res) {
  try {
    const response = await service.deleteTask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listTasks(req, res) {
  try {
    const response = await service.listTasks(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editTask(req, res) {
  try {
    const response = await service.editTask(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createTask,
  deleteTask,
  listTasks,
  editTask,
};
