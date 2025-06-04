// config/mongooseConnect.js

const mongoose = require('mongoose');

// Prevent multiple connections (especially in dev or with hot reload)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning_db';

  try {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
