const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  deleteUser,
  profile
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.delete('/delete', authMiddleware, deleteUser);
router.get('/profile', authMiddleware, profile);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {

    const payload = {
      id: req.user.id,
      email: req.user.email
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    });

    res.json({
      message: 'Login Google berhasil',
      accessToken
    });
  }
);

module.exports = router;
