const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token missing" });
  }

  const jwtToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
