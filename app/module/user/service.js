const bcrypt = require("bcrypt");
const { User } = require("./model");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { ACCOUNT_STATUS } = require("../../utils/constant");

const secretKey = process.env.JWT_SECRET;
const duration = process.env.JWT_TOKEN_VALIDITY;
// const secreteKey = process.env.APP_KEY;

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

  // userObj.token = await encodeJwt({
  //   data: { id, createdAt: new Date() },
  //   secreteKey: process.env.APP_KEY,
  //   duration: process.env.JWT_TOKEN_VALIDITY,
  // });

  userObj.token = jwt.sign(
    {
      id,
      createdAt: new Date(),
    },
    secretKey,
    {
      expiresIn: duration,
    }
  );

  const userToken = await User.findByIdAndUpdate(
    userObj._id,
    { token: userObj.token },
    { returnOriginal: false }
  );
  return { userToken };
}

const signup = async (body) => {
  try {
    const { email, password } = body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return { message: `${email} already exists !` };
    } else {
      let newUser = new User();
      newUser.email = email.trim();
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();
      const data = await setAuth(newUser);

      //=============================
      const verifyToken = data.userToken.token;

      const theLink = `https://beatlabapi.vercel.app/v1/user/verify-account?token=${verifyToken}`;
      const mailSubject = "Account Creation";
      const mailBody = `Your account has been created successfully. \nClick the following link to verify your email: ${theLink}`;

      sendEMail(senderMail, email, mailSubject, mailBody);
      //===============================

      return {
        data,
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
      return { error: `User does not exist !` };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: { message: ` Password is incorrect !` } };
    }

    return {
      data: await setAuth(user),
      message: "Successfully logged in",
    };
  } catch (err) {
    return { error: { message: "Invalid login credentials !" } };
  }
}

async function autoLogin(body) {
  try {
    const { email } = body;

    const user = await User.findOne({ email });

    if (!user) {
      return { error: `User does not exist !` };
    }

    return {
      data: await setAuth(user),
      message: "Successfully logged in",
    };
  } catch (err) {
    return { error: { message: "Invalid login !", err } };
  }
}

const listUsers = async () => {
  try {
    const users = await User.find();

    return {
      data: users,
      message: `Users Listed Successfully`,
    };
  } catch (err) {
    return { message: "Internal Server Error" };
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // Link to front end form for resetting password
    const theLink = `https://beatlab.vercel.app/reset-password?token=${resetToken}`;
    /* Retrieve token from link in email, create form 
        with password and confirmPassword and post to 
        `https://beatlabapi.vercel.app/v1/user/reset-password?token=${resetToken}` 
        with password and confirmPassword as body params
      */

    // const theLink = `https://beatlabapi.vercel.app/v1/user/reset-password?token=${resetToken}`;
    const mailSubject = "BeatLab Password Reset";
    const mailBody = `Click the following link to reset your password: ${theLink}`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    res.json({
      data: { message: "Password reset email sent !", token: resetToken },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return res.status(200).json({ message: "Password does not match !" });

    const { userId } = jwt.verify(token, secretKey);

    if (!userId) {
      return { error: { message: "Invalid token !", err } };
    }

    const user = await User.findById(userId);

    if (!user) {
      throw "User does not exist !";
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.status = ACCOUNT_STATUS.ACTIVE;

    const email = user.email;

    await user.save();

    const mailSubject = "BeatLab Password Changed !";
    const mailBody = `Your account [${email}], has been successfully updated with a new password.`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    return res.json({
      data: user,
      message: "New password set successfully",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const changePassword = async (req, res) => {
  try {
    token = req.headers.authorization.split(" ")[1];

    // const token = req.headers["authorization"];
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword)
      return res.status(200).json({ message: "Password does not match !" });

    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
      return res.status(403).json({ error: "Invalid authorization token !" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(200).json({ message: "User does not exist !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    const email = user.email;

    await user.save();

    const mailSubject = "BeatLab Password Changed !";
    const mailBody = `Your account [${email}], has been successfully updated with a new password.`;

    await sendEMail(senderMail, email, mailSubject, mailBody);

    return res.json({
      data: user,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, password, category, plan, fullname } = req.body;

    token = req.headers.authorization.split(" ")[1];

    const { id } = jwt.verify(token, secretKey);

    const user = await User.findById(id);

    if (user) {
      user.fullname = fullname;
      user.category = category.toUpperCase();
      user.email = email.trim();

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      user.plan = plan.toUpperCase();

      await user.save();

      return {
        data: await setAuth(user),
        message: `User Profile Updated Successfully`,
      };
    } else {
      return {
        message: `Unable to update profile`,
      };
    }
  } catch (err) {
    throw err;
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const { id } = decoded;

    const user = await User.findById(id);

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
  autoLogin,
  listUsers,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  verifyAccount,
};
