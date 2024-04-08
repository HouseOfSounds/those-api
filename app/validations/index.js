const Joi = require("joi");

module.exports = {
  Note: {
    body: {
      schema: Joi.object({
        noteuid: Joi.string(),
        notetitle: Joi.string().min(3).max(50).required(),
        notebody: Joi.string().min(10).max(300).required(),
      }),
    },
  },

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
