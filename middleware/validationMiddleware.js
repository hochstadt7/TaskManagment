const validator = require('validator');
const sanitizeHtml = require('sanitize-html');
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Exctract the token itself. authHeader is typically of the form `Bearer ${token}`
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) { return res.sendStatus(401); }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

function validateAndSanitizeTask(req, res, next) {
  let { title, description } = req.body;

  // Validate and sanitize inputs
  if (!validator.isLength(title, { min: 1, max: 100 })) {
    return res.status(400).json({ message: 'Title must be between 1 and 100 characters.' });
  }

  req.body.title = sanitizeHtml(title);
  req.body.description = sanitizeHtml(description);

  next();
}

function validateAndSanitizeAuth(req, res, next) {
    let { username, password } = req.body;
    // Validate and sanitize inputs
    if (!validator.isLength(username, { min: 3, max: 30 })) {
      return res.status(400).json({ message: 'Username must be between 3 and 30 characters.' });
    }
  
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    req.body.username = sanitizeHtml(username);
    req.body.password = sanitizeHtml(password);
  
    next();
  }

module.exports = {validateAndSanitizeTask, validateAndSanitizeAuth, authenticateToken, JWT_SECRET};
