const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check karein ke decoded mein id hai ya userId
      const userId = decoded.id || decoded.userId; 
      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied, Admin only' });
};

const workerOnly = (req, res, next) => {
  if (req.user && ['worker', 'Agent', 'Worker'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied, Worker only' });
};

module.exports = { protect, adminOnly, workerOnly };