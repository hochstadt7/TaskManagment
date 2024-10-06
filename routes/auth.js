const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateAndSanitizeAuth, JWT_SECRET } = require('../middleware/validationMiddleware');

const router = express.Router();
const users = {}; // In-memory db

router.post('/register', validateAndSanitizeAuth, async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword };
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, refreshToken });
});

router.post('/login', validateAndSanitizeAuth, async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, refreshToken });
});

router.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: 'Missing refresh token' });
  }
  jwt.verify(refreshToken, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ token });
  });
});

module.exports = router;
