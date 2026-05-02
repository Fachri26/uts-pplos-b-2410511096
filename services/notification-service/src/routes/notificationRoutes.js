const express = require('express');
const router = express.Router();

const {
  createNotification,
  getByUser
} = require('../controllers/notificationController');

router.post('/', createNotification);
router.get('/user/:id', getByUser);

module.exports = router;
