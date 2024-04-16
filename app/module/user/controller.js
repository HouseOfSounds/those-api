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

async function login(req, res) {
  try {
    const result = await service.login(req.body);

    return res.status(200).json(result);
  } catch (err) {
    throw err;
  }
}

async function autoLogin(req, res) {
  try {
    const result = await service.autoLogin(req.body);

    return res.status(200).json(result);
  } catch (err) {
    throw err;
  }
}

async function listUsers(req, res) {
  try {
    const result = await service.listUsers();

    return res.status(200).json(result);
  } catch (err) {
    throw err;
  }
}

async function forgotPassword(req, res) {
  try {
    const response = await service.forgotPassword(req, res);

    return response;
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

async function updateProfile(req, res) {
  try {
    const response = await service.updateProfile(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function viewUser(req, res) {
  try {
    const response = await service.viewUser(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

async function viewTaskUser(req, res) {
  try {
    const response = await service.viewTaskUser(req, res);

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
}

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
  viewUser,
  viewTaskUser,
};
