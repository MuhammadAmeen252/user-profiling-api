const mongoose = require("mongoose");

export const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      return console.log(`DATABASE CONNECTION SUCCESSFUL !`);
    })
    .catch((error: Error) => {
      console.log("Error connecting to database: ", error.message);
      return process.exit(1);
    });
};