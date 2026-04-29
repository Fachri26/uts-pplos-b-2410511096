const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  profile
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);

module.exports = router;
