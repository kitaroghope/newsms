const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/userModel');

// GET /api/profiles/:role
router.get('/:role', auth, async (req, res) => {
  try {
    const { role } = req.params;
    console.log(role);
    // Only allow access to your own role profile
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ message: `Access denied: you don't have ${role} rights.` });
    }

    const user = await User.User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
