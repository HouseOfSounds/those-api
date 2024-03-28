const service = require("./service");

async function signup(req, res) {
  try {
    const { data, message } = await service.signup(req.body);

    return res.status(200).json({ data, message });
  } catch (err) {
    const { message, httpStatusCode } = err;
    return res
      .status(err.httpStatusCode)
      .json({ httpStatusCode, error: message });
  }
}
//
async function login(req, res) {
  try {
    const result = await service.login(req.body);

    return res.status(200).json(result);
  } catch (err) {
    throw err;
  }
}

async function listUsers(req, res) {
  try {
    const result = await service.listUsers(req);

    return res.status(200).json(result);
  } catch (err) {
    throw err;
  }
}

async function resetPassword(req, res) {
  try {
    const response = await service.resetPassword(req, res);

    return response;
  } catch (err) {
    throw err;
  }
}

async function changePassword(req, res) {
  try {
    const response = await service.changePassword(req, res);

    return response;
  } catch (err) {
    throw err;
  }
}

const verifyAccount = async (req, res) => {
  try {
    const response = await service.verifyAccount(req, res);

    return response;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  signup,
  login,
  listUsers,
  resetPassword,
  changePassword,
  verifyAccount,
};
