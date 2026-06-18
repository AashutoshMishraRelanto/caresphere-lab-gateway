const express = require('express');
const { getResultsByPatientId, createLabOrder } = require('../controllers/labController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all lab routes
router.use(protect);

router.get('/results/:patientId', getResultsByPatientId);
router.post('/orders', createLabOrder);

module.exports = router;
