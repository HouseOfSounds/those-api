const mongoose = require("mongoose");
const { CATEGORY, ACCOUNT_STATUS, PLAN } = require("../../utils/constant");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  category: {
    type: String,
    enum: Object.keys(CATEGORY),
    required: false,
  },

  plan: {
    type: String,
    enum: Object.keys(PLAN),
    default: PLAN.BASIC,
    required: false,
  },

  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: Object.keys(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.UNVERIFIED,
  },

  token: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  deleted: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const User = mongoose.model("user", userSchema);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

async function comparePassword(plainText, hash) {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  User,
  comparePassword,
};
