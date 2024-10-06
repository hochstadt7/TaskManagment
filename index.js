require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const https = require('https');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

/*
In the excersie it is mentioned that the API endpoints are:
1. /register 2. /login 3. /token
However, I prefered to centralize them under /auth, because they are all
authentication-related. So for example, /login will be replaced by /auth/login
*/
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

// HTTPS setup (self-signed certificate)
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`https server running on port ${PORT}`);
});
