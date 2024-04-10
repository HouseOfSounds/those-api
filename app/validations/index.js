const Joi = require("joi");

module.exports = {
  Note: Joi.object({
    noteUserId: Joi.string(),
    notetitle: Joi.string().min(3).max(50).required(),
    notebody: Joi.string().min(10).max(500).required(),
  }),

  Project: Joi.object({
    projectUserId: Joi.string(),
    name: Joi.string().min(3).max(50).required(),
    artist: Joi.string().min(3).max(50).required(),
    type: Joi.string()
      .valid("MUSIC", "PODCAST", "AUDIOBOOK", "OTHER")
      .trim()
      .required(),
    description: Joi.string().min(3).max(500).required(),

    startDate: Joi.date().min(new Date()).required(),
    endDate: Joi.date().min(new Date()).required(),

    // endDate: Joi.date()
    //   .min(Joi.ref("startDate"), ">=")
    //   .required()
    //   .raw()
    //   .min((value) => {
    //     const startDate = new Date(value);
    //     const endDate = new Date();
    //     endDate.setDate(startDate.getDate() + 2);
    //     return endDate;
    //   })
    // .error(() => {
    //   return new Error(
    //     "end date must be at least 2 days more than start date"
    //   );
    // }),

    budget: Joi.number().required(),

    // createdAt: Joi.date().default(Date.now()).required(),
  }),

  Organisation: Joi.object({
    organisationUserId: Joi.string(),
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(500).required(),
  }),

  contactForm: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().trim().lowercase().required(),
    subject: Joi.string().min(5).max(100).required(),
    message: Joi.string().min(10).max(500).required(),
  }),
};
