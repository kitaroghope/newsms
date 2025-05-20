// app.js

const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(cors({
  origin: '*', // replace with your client URL
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
