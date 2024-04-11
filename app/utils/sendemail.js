const nodemailer = require("nodemailer");

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

const sendEMail = async (to, subject, text) => {
  const mailOptions = {
    from: senderMail,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEMail };
