// models/course.js

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: String,
  category: String,
  duration: String, // e.g. "4 weeks"
  level: String, // beginner, intermediate, advanced
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
