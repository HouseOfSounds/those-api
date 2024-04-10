const jwt = require("jsonwebtoken");
const { User } = require("../module/user/model");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token missing" });
  }

  const jwtToken = token.split(" ")[1];

  const { id } = jwt.verify(jwtToken, process.env.JWT_SECRET);

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: `User does not exist !` });
    } else {
      next();
    }
  } catch (err) {
    // throw err;
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
