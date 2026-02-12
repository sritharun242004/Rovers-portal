const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log('=== CONNECTING TO MONGODB ===');
    console.log('MongoDB URI:', process.env.DATABASE_URL?.replace(/\/\/([^:]+):([^@]+)@/, '//USERNAME:PASSWORD@'));

   const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Test a query to verify connection is working
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name).join(', '));
    } catch (err) {
      console.error('Error listing collections:', err);
    }

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = { connectDB };