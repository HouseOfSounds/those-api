const { Organisation } = require("./organisation");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const createOrganisation = async (req, res) => {
  console.log("==== Creating Organisation ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const orgBody = { organisationUserId: id, ...req.body };
    const organisation = new Organisation(orgBody);

    await organisation.save();

    return {
      data: organisation,
      message: `Organisation Created Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

const deleteOrganisation = async (req, res) => {
  console.log("==== Deleting Organisation ====");
  const token = req.headers.authorization.split(" ")[1];

  const { id } = jwt.verify(token, secretKey);

  try {
    const { organisationid } = req.params;
    const filter = { _id: organisationid, organisationUserId: id };

    const response = await Organisation.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        response,
        message: `Organisation Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Organisation ID ${organisationid} does not exist.`,
      };
    }
  } catch (err) {
    throw err;
  }
};

const listOrganisations = async (req, res) => {
  console.log("==== List Organisation ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const organisations = await Organisation.find({ organisationUserId: id })
      .skip(skip)
      .limit(pageSize);

    const total = await Organisation.countDocuments({ organisationUserId: id });
    const pages = Math.ceil(total / pageSize);

    return {
      organisations,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Organisation Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing organisations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editOrganisation = async (req, res) => {
  console.log("==== Editing Organisation ====");
  const token = req.headers.authorization.split(" ")[1];

  const { id } = jwt.verify(token, secretKey);

  try {
    const { organisationid } = req.params;
    const filter = { _id: organisationid, organisationUserId: id };

    const organisation = await Organisation.findOne(filter);
    if (!organisation) {
      return {
        message: `Organisation ${organisationid} does not exist`,
      };
    } else {
      const orgBody = { ...req.body };

      Object.assign(organisation, orgBody);

      await organisation.save();

      return {
        organisation,
        message: `Organisation updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating organisation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrganisation,
  deleteOrganisation,
  listOrganisations,
  editOrganisation,
};
