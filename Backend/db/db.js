const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECT);
    console.log(`✅ Connected to MongoDB: ${process.env.DB_CONNECT}`);
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
};

module.exports = connectToDb;




