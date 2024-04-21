const { Invite } = require("./invite");
const jwt = require("jsonwebtoken");
const { sendEMail } = require("../../utils/sendemail");
const secretKey = process.env.JWT_SECRET;

const createInvite = async (req, res) => {
  console.log("==== Creating Invite ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const inviteBody = {
      inviteUserId: id,
      ...req.body,
    };

    const invite = new Invite(inviteBody);

    await invite.save();

    //=============================
    const { email } = req.body;

    const inviteToken = id;

    const theLink = `https://beatlabapi.vercel.app/v1/user/invite?token=${inviteToken}`;
    const mailSubject = "BeatLab Invite";
    const mailBody = `Your have been invited to collaborate on beatlab. \nClick the following link to accept the invite: ${theLink}`;

    await sendEMail(email, mailSubject, mailBody);
    //===============================

    return {
      data: invite,
      message: `Invite Successful`,
    };
  } catch (err) {
    return { error: "Internal server error" };
  }
};

const deleteInvite = async (req, res) => {
  console.log("==== Deleting Invite ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { inviteid } = req.params;
    const filter = { _id: inviteid, inviteUserId: id };

    const invite = await Invite.findOne(filter);
    const response = await Invite.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        invite,
        response,
        message: `Invite Deleted`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Invite ID ${taskid} does not exist.`,
      };
    }
  } catch (err) {
    return { error: "Internal server error" };
  }
};

const listInvites = async (req, res) => {
  console.log("==== List Invites ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  const { inviteid } = req.params;

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filter;

    if (inviteid !== undefined) {
      filter = { _id: inviteid, inviteUserId: id };
    } else {
      filter = { inviteUserId: id };
    }

    const invites = await Invite.find(filter).skip(skip).limit(pageSize);

    const total = await Invite.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    return {
      invites,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Invites Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing invites:", error);
    return { error: "Internal server error" };
  }
};

const editInvite = async (req, res) => {
  console.log("==== Editing Invite ====");
  const token = req.headers.authorization.split(" ")[1];
  const { id } = jwt.verify(token, secretKey);

  try {
    const { inviteid } = req.params;
    const filter = { _id: inviteid, inviteUserId: id };

    const invite = await Invite.findOne(filter);
    if (!invite) {
      return {
        message: `Invite ${inviteid} does not exist`,
      };
    } else {
      const inviteBody = { ...req.body };

      Object.assign(invite, inviteBody);

      await invite.save();

      return {
        invite,
        message: `Invite updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating invite:", error);
    return { error: "Internal server error" };
  }
};

module.exports = {
  createInvite,
  deleteInvite,
  listInvites,
  editInvite,
};
