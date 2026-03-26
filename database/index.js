const mongoose = require("mongoose");
mongoose.set("debug", true);

exports.mongoConnection = mongoose
  .connect(global.MONGO_DB_CONNECTION_STRING)
  .then(() => {
    console.log("-->> MongoDB connected successfully");
  })
  .catch((err) => console.log("MongoDB connection error -> ", err));
