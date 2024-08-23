const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('No token provided');
    return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      console.log('Invalid token');
      return res.status(400).send('Invalid token.');
    }
    req.user = decoded;
    next();
  });
}

module.exports = auth;