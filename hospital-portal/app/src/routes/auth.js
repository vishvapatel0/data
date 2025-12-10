const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/database');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      department: user.department 
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    access_token: token,
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department
    }
  });
});

module.exports = router;
