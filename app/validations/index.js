const Joi = require("joi");

module.exports = {
  Note: Joi.object({
    noteUserId: Joi.string(),
    notetitle: Joi.string().min(3).max(50).required(),
    notebody: Joi.string().min(10).max(500).required(),
  }),

  Project: Joi.object({
    projectUserId: Joi.string(),
    organisationId: Joi.string(),
    name: Joi.string().min(3).max(50).required(),
    artist: Joi.string().min(3).max(50).required(),
    type: Joi.string()
      .valid("MUSIC", "PODCAST", "AUDIOBOOK", "OTHER")
      .trim()
      .required(),
    description: Joi.string().min(3).max(500).required(),
    status: Joi.string().default("IN PROGRESS"),

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

  Task: Joi.object({
    taskProjectId: Joi.string(),
    taskUserId: Joi.string(),
    name: Joi.string().min(3).max(100).trim(),
    description: Joi.string().max(500),
    status: Joi.string().default("IN PROGRESS"),
    budget: Joi.number(),
    members: Joi.array().items(Joi.string().trim()),
    startDate: Joi.date().min(new Date()),
    endDate: Joi.date().min(new Date()),
  }),

  Subtask: Joi.object({
    subtaskTaskId: Joi.string(),
    subtaskUserId: Joi.string(),
    name: Joi.string().min(3).max(100).trim(),
    description: Joi.string().max(500),
    status: Joi.string().default("IN PROGRESS"),
    budget: Joi.number(),
    members: Joi.array().items(Joi.string().trim()),
    startDate: Joi.date().min(new Date()),
    endDate: Joi.date().min(new Date()),
  }),
};
