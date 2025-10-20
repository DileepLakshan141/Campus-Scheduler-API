const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conObj = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`connected to the host: ${conObj.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
