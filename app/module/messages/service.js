const { Message } = require("./message");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const secretKey = process.env.JWT_SECRET;
const senderMail = process.env.SENDER_EMAIL;
const senderPassword = process.env.SENDER_PASSWORD;
const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user: senderMail,
    pass: senderPassword,
  },
});

const createMessage = async (req, res) => {
  console.log("==== Creating Message ====");

  try {
    const msgBody = { ...req.body };
    const message = new Message(msgBody);

    await message.save();

    //=============================
    const { email, subject } = req.body;

    sendEMail(senderMail, email, subject, req.body.message);
    //===============================

    return {
      data: message,
      message: `Message Created Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

const deleteMessage = async (req, res) => {
  console.log("==== Deleting Message ====");
  // const token = req.headers.authorization.split(" ")[1];
  // const { id } = jwt.verify(token, secretKey);

  try {
    const { messageid } = req.params;
    const filter = { _id: messageid };

    const response = await Message.deleteOne(filter);
    const { deletedCount } = response;
    if (deletedCount == 1) {
      return {
        response,
        message: `Message Deleted Successfully`,
      };
    } else if (deletedCount == 0) {
      return {
        response,
        message: `Message ID ${messageid} does not exist.`,
      };
    }
  } catch (err) {
    throw err;
  }
};

const listMessages = async (req, res) => {
  console.log("==== List Messages ====");
  // const token = req.headers.authorization.split(" ")[1];
  // const { id } = jwt.verify(token, secretKey);

  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const messages = await Message.find().skip(skip).limit(pageSize);

    const total = await Message.countDocuments();
    const pages = Math.ceil(total / pageSize);

    return {
      messages,
      pages,
      currentPage: page,
      pageSize,
      total,
      message: `Messages Listed successfully`,
    };
  } catch (error) {
    console.error("Error listing messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editMessage = async (req, res) => {
  console.log("==== Editing Message ====");
  // const token = req.headers.authorization.split(" ")[1];
  // const { id } = jwt.verify(token, secretKey);

  try {
    const { messageid } = req.params;
    const filter = { _id: messageid };

    const message = await Message.findOne(filter);
    if (!Message) {
      return {
        message: `Message ${messageid} does not exist`,
      };
    } else {
      const msgBody = { ...req.body };
      Object.assign(message, msgBody);

      await message.save();

      return {
        data: message,
        message: `Message updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendEMail = async (from, to, subject, text) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  createMessage,
  deleteMessage,
  listMessages,
  editMessage,
};
