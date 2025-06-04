const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Create a new user (Register)
router.post('/', async (req, res) => {
    try {
        const existing = await userModel.findUserByEmail(req.body.email);
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };

        const result = await userModel.createUser(userData);
        res.status(201).json({ message: 'User created', user: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Login route
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await userModel.findUserByEmail(email);

//         if (!user) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: '2h'
//         });

//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findUserByEmail(email);

  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'kita',
    { expiresIn: '2h' }
  );

  // ✅ Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // only in prod
    sameSite: 'lax', // or 'strict'
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  });

  res.json({ message: 'Login successful', user: {
    _id: user._id, name: user.name, email: user.email, role: user.role
  }});
});


// Get a user by email
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await userModel.findUserByEmail(email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user
router.put('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const updates = req.body;
        const result = await userModel.updateUser(email, updates);
        res.status(200).json({ message: 'User updated', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        await userModel.deleteUser(email);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List users (optionally filtered)
router.get('/', async (req, res) => {
    try {
        const filter = req.query || {};
        const users = await userModel.listUsers(filter);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
