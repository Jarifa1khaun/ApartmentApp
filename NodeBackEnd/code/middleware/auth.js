const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
    const decoded = jwt.verify(token, jwtPrivateKey);
    
    if (decoded.validity === undefined || decoded.validity < new Date().getTime()) {
      return res.status(401).send('Token timeout. Need to login again.');
    }

    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}