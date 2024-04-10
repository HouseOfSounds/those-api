const {
  InvalidTokenError,
  TokenExpiredError,
  AuthorizationError,
  errorMessage,
} = require("iyasunday");

const { User } = require("../module/user/model");
const Jwt = require("jsonwebtoken");

module.exports = function guard(can = undefined) {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (!token)
        throw new InvalidTokenError(
          "Kindly provide valid authentication token"
        );
      token = token.split(" ").pop();
      const tokenRef = Jwt.verify(token, process.env.JWT_SECRET);
      if (!tokenRef) throw new InvalidTokenError("Supplied token not valid");
      const user = await User.findById(tokenRef.id);
      if (!user) throw new TokenExpiredError("Session expired");
      //if (!user.isVerified) throw new Error('Sorry, your account is not verified yet. Please check your email and complete account verification');
      req.user = user;
      if (
        can &&
        !user.permissions.includes(can) &&
        !user.permissions.includes("all")
      )
        throw new AuthorizationError("Access denied");
      req.user = user;
      return next();
    } catch (err) {
      return res.status(err.httpStatusCode || 500).json(errorMessage(err));
    }
  };
};
