// models/userModel.js

const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed in practice
  role: { type: String, default: 'user' }
});

// Create the model
const User = mongoose.model('User', userSchema);

// Equivalent functions using Mongoose
async function createUser(userData) {
  const user = new User(userData);
  return await user.save();
}

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function updateUser(email, updates) {
  return await User.findOneAndUpdate({ email }, updates, { new: true });
}

async function deleteUser(email) {
  return await User.findOneAndDelete({ email });
}

async function listUsers(filter = {}) {
  return await User.find(filter);
}

module.exports = {
  createUser,
  findUserByEmail,
  updateUser,
  deleteUser,
  listUsers,
  User // exporting model in case you need it elsewhere
};
