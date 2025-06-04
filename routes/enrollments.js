const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel');

// Enroll a user in a course
router.post('/', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrollment successful', enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title');
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete enrollment by ID
router.delete('/:id', async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
