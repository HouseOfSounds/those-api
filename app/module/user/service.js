const { success, encodeJwt, decodeJwt, ExistsError } = require("iyasunday");
const bcrypt = require("bcrypt");
const { User } = require("./model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { ACCOUNT_STATUS } = require("../../utils/constant");

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

async function setAuth(userObj) {
  const id = userObj._id;
  userObj.id = id;
  userObj.token = await encodeJwt({
    data: { id, createdAt: new Date() },
    secreteKey: process.env.APP_KEY,
    duration: process.env.JWT_TOKEN_VALIDITY,
  });
  const userToken = await User.findByIdAndUpdate(
    userObj._id,
    { token: userObj.token },
    { returnOriginal: false }
  );
  return userToken;
}

const signup = async (body) => {
  try {
    // const { email, password, category, plan, fullname } = body;
    const { email, password } = body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new ExistsError(`${email} already Exist`);
    } else {
      let newUser = new User();
      // newUser.fullname = fullname;
      // newUser.category = category.toUpperCase();
      newUser.email = email.trim();
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      // newUser.plan = plan.toUpperCase();

      await newUser.save();

      //=============================
      const user = await User.findOne({ email });
      const verifyToken = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1h",
      });

      // await sendVerificationMail(email, verifyToken);
      const theLink = `http://those.app/verify-account?token=${verifyToken}`;
      const mailSubject = "Account Creation";
      const mailBody = `Your account has been created successfully. \nClick the following link to verify your email: ${theLink}`;

      sendEMail(senderMail, email, mailSubject, mailBody);
      //===============================

      return {
        data: await setAuth(newUser),
        message: `User Created Successfully`,
      };
    }
  } catch (err) {
    throw err;
  }
};

async function login(body) {
  try {
    const { email, password } = body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AuthenticationError(` User does not exist !`);
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AuthenticationError(` Password is incorrect !`);
    }

    return {
      success,
      data: await setAuth(user),
    };
  } catch (err) {
    // throw err;
    return { error: { message: "Invalid login credentials !" } };
  }
}

const listUsers = async (req) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      throw new AuthenticationError("Token not provided");
    }

    const decoded = await decodeJwt(token, process.env.APP_KEY);

    if (!decoded) {
      throw new AuthenticationError("Invalid token !");
    }

    const users = await User.find();
    return {
      success,
      data: users,
      message: `Users Listed Successfully`,
    };
  } catch (err) {
    throw err;
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    const theLink = `http://those.app/reset-password?token=${resetToken}`;
    const mailSubject = "Password Reset";
    const mailBody = `Click the following link to reset your password: ${theLink}`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    res.json({
      data: { message: "Password reset email sent !", token: resetToken },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const changePassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken || !decodedToken.userId) {
      throw "Invalid token !";
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      // return res.status(404).json({ error: "User not found" });
      throw "User does not exist !";
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.status = ACCOUNT_STATUS.ACTIVE;

    const email = user.email;

    await user.save();

    const mailSubject = "Password Changed !";
    const mailBody = `Your account [${email}], has been successfully updated with a new password.`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    return res.json({
      data: user,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken || !decodedToken.userId) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.status = ACCOUNT_STATUS.ACTIVE;

    const email = user.email;

    await user.save();

    const mailSubject = "Account Verification Completed!";
    const mailBody = `Your account [${email}], has been successfully verified.`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    res.status(200).json({
      data: user,
      message: "Account verification successful.",
    });
  } catch (error) {
    console.error("Error occurred during account verification:", error);
    res.status(500).json({ error: error.message });
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
  signup,
  login,
  listUsers,
  resetPassword,
  changePassword,
  verifyAccount,
};