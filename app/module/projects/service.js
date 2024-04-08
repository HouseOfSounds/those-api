const { Project } = require("./project");

const { decodeJwt } = require("iyasunday");

const createProject = async (req, res) => {
  console.log("==== Creating Project ====");
  const token = req.headers["authorization"];
  const { id } = await decodeJwt(token, process.env.APP_KEY);

  try {
    const { title, description } = req.body;

    const project = new Project({
      title,
      description,
      projectuid: id,
    });

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
  const token = req.headers["authorization"];
  const { id } = await decodeJwt(token, process.env.APP_KEY);

  try {
    const { projectid } = req.params;
    const filter = { _id: projectid, projectuid: id };

    const response = await Project.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
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

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const projects = await Project.find().skip(skip).limit(pageSize);

    const total = await Project.countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.status(200).json({
      projects,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Projects Listed successfully`,
    });
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editProject = async (req, res) => {
  console.log("==== Editing Project ====");
  const token = req.headers["authorization"];
  const { id } = await decodeJwt(token, process.env.APP_KEY);

  try {
    const { projectid } = req.params;
    const filter = { _id: projectid, projectuid: id };

    const project = await Project.findOne(filter);
    if (!project) {
      return {
        message: `${projectid} does not exist`,
      };
    } else {
      const { title, description } = req.body;
      Object.assign(project, { title, description });

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
