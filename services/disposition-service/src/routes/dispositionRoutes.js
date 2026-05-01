const express = require('express');
const router = express.Router();

const {
  createDisposition,
  getByComplaint,
  updateDisposition,
  getUnits
} = require('../controllers/dispositionController');

router.post('/', createDisposition);
router.get('/complaint/:id', getByComplaint);
router.put('/:id', updateDisposition);
router.get('/units', getUnits);

module.exports = router;
