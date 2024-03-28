const Joi = require("joi");

module.exports = {
  signup: {
    body: {
      schema: Joi.object({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().required(),
        // fullname: Joi.string().max(100).trim().required(),
        // category: Joi.string()
        //   .valid("PRODUCER", "ARTISTS", "FANS", "ENGINEERS & OTHERS")
        //   .trim()
        //   .required(),
        // plan: Joi.string()
        //   .valid("BASIC", "PREMIUM", "ADVANCED", "CUSTOM")
        //   .trim()
        //   .required(),
        token: Joi.string(),
      }),
    },
  },

  login: {
    body: {
      schema: Joi.object({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().required(),
      }),
    },
  },

  resetPassword: {
    body: {
      schema: Joi.object({
        email: Joi.string().email().trim().lowercase().required(),
      }),
    },
  },
};
