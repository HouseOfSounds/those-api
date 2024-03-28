/* eslint-disable no-console */
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
const dbn = process.env.DB_NAME;

const connectDB = async () => {
  await mongoose.set("strictQuery", false);
  await mongoose
    .connect(`${uri}${dbn}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected....");
    })
    .catch((err) => {
      console.log(`MongoDB connection failed`);
      console.error(err.message);
      process.exit(1);
    });
};

module.exports = connectDB;
