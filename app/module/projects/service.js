const { Project } = require("./project");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const createProject = async (req, res) => {
  console.log("==== Creating Project ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { organisationid } = req.params;

  try {
    console.log("orgid", organisationid);

    const proBody = {
      projectUserId: id,
      ...req.body,
    };

    if (organisationid !== undefined) {
      proBody.organisationId = organisationid;
    }

    const project = new Project(proBody);

    await project.save();

    return {
      data: project,
      message: `Project Created Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

const deleteProject = async (req, res) => {
  console.log("==== Deleting Project ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { projectid } = req.params;
    const filter = { _id: projectid, projectUserId: id };

    const project = await Project.findOne(filter);
    const response = await Project.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        project,
        response,
        message: `Project Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Project ID ${projectid} does not exist.`,
      };
    }
  } catch (err) {
    throw err;
  }
};

const listProjects = async (req, res) => {
  console.log("==== List Projects ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { organisationid } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filter;

    if (organisationid !== undefined) {
      filter = { projectUserId: id, organisationId: organisationid };
    } else {
      filter = { projectUserId: id };
    }

    const projects = await Project.find(filter).skip(skip).limit(pageSize);

    const total = await Project.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    return {
      projects,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Projects Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editProject = async (req, res) => {
  console.log("==== Editing Project ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { projectid } = req.params;
    const filter = { _id: projectid, projectUserId: id };

    const project = await Project.findOne(filter);
    if (!project) {
      return {
        message: `Project ${projectid} does not exist`,
      };
    } else {
      const proBody = { ...req.body };

      Object.assign(project, proBody);

      await project.save();

      return {
        project,
        message: `Project updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProject,
  deleteProject,
  listProjects,
  editProject,
};
