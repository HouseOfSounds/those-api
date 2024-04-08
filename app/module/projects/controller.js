const service = require("./service");

async function createProject(req, res) {
  try {
    const response = await service.createProject(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteProject(req, res) {
  try {
    const response = await service.deleteProject(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listProjects(req, res) {
  try {
    const response = await service.listProjects(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editProject(req, res) {
  try {
    const response = await service.editProject(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createProject,
  deleteProject,
  listProjects,
  editProject,
};
