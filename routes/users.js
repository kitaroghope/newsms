// routes/users.js

const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');

// Create a new user
router.post('/', async (req, res) => {
    try {
        const result = await userModel.createUser(req.body);
        res.status(201).json({ message: 'User created', result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a user by email
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await userModel.findUserByEmail(email);
        if (result.found) {
            res.status(200).json(result.listing);
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
        const result = await userModel.listUsers(filter);
        res.status(200).json(result.listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
