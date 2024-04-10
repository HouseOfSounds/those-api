const service = require("./service");

async function createOrganisation(req, res) {
  try {
    const response = await service.createOrganisation(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function deleteOrganisation(req, res) {
  try {
    const response = await service.deleteOrganisation(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function listOrganisations(req, res) {
  try {
    const response = await service.listOrganisations(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function editOrganisation(req, res) {
  try {
    const response = await service.editOrganisation(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createOrganisation,
  deleteOrganisation,
  listOrganisations,
  editOrganisation,
};
