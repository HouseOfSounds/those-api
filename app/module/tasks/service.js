const { Task } = require("./task");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const createTask = async (req, res) => {
  console.log("==== Creating Task ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { projectid } = req.params;

  try {
    console.log("prjid", projectid);

    const taskBody = {
      taskUserId: id,
      ...req.body,
    };

    if (projectid !== undefined) {
      taskBody.taskProjectId = projectid;
    }

    const task = new Task(taskBody);

    await task.save();

    return {
      data: task,
      message: `Task Created Successfully`,
    };
  } catch (err) {
    return { error: "Internal server error" };
  }
};

const deleteTask = async (req, res) => {
  console.log("==== Deleting Task ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { taskid } = req.params;
    const filter = { _id: taskid, taskUserId: id };

    const task = await Task.findOne(filter);
    const response = await Task.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        task,
        response,
        message: `Task Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Task ID ${taskid} does not exist.`,
      };
    }
  } catch (err) {
    return { error: "Internal server error" };
  }
};

const listTasks = async (req, res) => {
  console.log("==== List Tasks ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { projectid } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filter;

    if (projectid !== undefined) {
      filter = { taskUserId: id, taskProjectId: projectid };
    } else {
      filter = { taskUserId: id };
    }

    const tasks = await Task.find(filter).skip(skip).limit(pageSize);

    const total = await Task.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    return {
      tasks,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Tasks Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing tasks:", error);
    return { error: "Internal server error" };
  }
};

const editTask = async (req, res) => {
  console.log("==== Editing Task ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { taskid } = req.params;
    const filter = { _id: taskid, taskUserId: id };

    const task = await Task.findOne(filter);
    if (!task) {
      return {
        message: `Task ${taskid} does not exist`,
      };
    } else {
      const taskBody = { ...req.body };

      Object.assign(task, taskBody);

      await task.save();

      return {
        task,
        message: `Task updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Internal server error" };
  }
};

module.exports = {
  createTask,
  deleteTask,
  listTasks,
  editTask,
};
