const mongoose = require("mongoose");
const mySecret = process.env["ATLAS_URI"];
const connectDB = async () => {

  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
