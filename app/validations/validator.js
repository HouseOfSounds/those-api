const validator = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  } else {
    next();
  }
};

module.exports = { validator };
