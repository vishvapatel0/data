const express = require('express');
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../models/database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ access_token: token, token_type: 'bearer' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  const user = getUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  });
});

module.exports = router;
