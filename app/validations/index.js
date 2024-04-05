const Joi = require("joi");

module.exports = {
  contactForm: {
    body: {
      schema: Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().trim().lowercase().required(),
        subject: Joi.string().min(5).max(100).required(),
        message: Joi.string().min(10).max(500).required(),
      }),
    },
  },
};
