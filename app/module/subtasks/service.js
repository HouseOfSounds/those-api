const { Subtask } = require("./subtask");
const jwt = require("jsonwebtoken");
//
const secretKey = process.env.JWT_SECRET;

const createSubtask = async (req, res) => {
  console.log("==== Creating Subtask ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { taskid } = req.params;

  try {
    console.log("prjid", taskid);

    const subtaskBody = {
      subtaskUserId: id,
      ...req.body,
    };

    if (taskid !== undefined) {
      subtaskBody.subtaskTaskId = taskid;
    }

    const subtask = new Subtask(subtaskBody);

    await subtask.save();

    return {
      data: subtask,
      message: `Subtask Created Successfully`,
    };
  } catch (err) {
    console.error("Error listing Subtasks:", err);
    return { error: "Internal server error" };
    // throw err;
  }
};

const deleteSubtask = async (req, res) => {
  console.log("==== Deleting Subtask ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { subtaskid } = req.params;
    const filter = { _id: subtaskid, subtaskUserId: id };

    const subtask = await Subtask.findOne(filter);
    const response = await Subtask.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        subtask,
        response,
        message: `Subtask Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Subtask ID ${subtaskid} does not exist.`,
      };
    }
  } catch (err) {
    // throw err.message;
    console.error("Error deleting Subtasks:", err);
    return { error: "Internal server error" };
  }
};

const listSubtasks = async (req, res) => {
  console.log("==== List Subtasks ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { taskid } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filter;

    if (taskid !== undefined) {
      filter = { subtaskUserId: id, subtaskTaskId: taskid };
    } else {
      filter = { subtaskUserId: id };
    }

    const subtasks = await Subtask.find(filter).skip(skip).limit(pageSize);

    const total = await Subtask.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    return {
      subtasks,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Subtasks Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing Subtasks:", error);
    return { error: "Internal server error" };
  }
};

const editSubtask = async (req, res) => {
  console.log("==== Editing Subtask ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { subtaskid } = req.params;
    const filter = { _id: subtaskid, subtaskUserId: id };

    const subtask = await Subtask.findOne(filter);
    if (!subtask) {
      return {
        message: `Subtask ${subtaskid} does not exist`,
      };
    } else {
      const subtaskBody = { ...req.body };

      Object.assign(subtask, subtaskBody);

      await subtask.save();

      return {
        subtask,
        message: `Subtask updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating Subtask:", error);
    return { error: "Internal server error" };
  }
};

module.exports = {
  createSubtask,
  deleteSubtask,
  listSubtasks,
  editSubtask,
};
