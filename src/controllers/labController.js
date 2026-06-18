const LabResult = require('../models/LabResult');

// Get Lab Results by Patient ID
const getResultsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await LabResult.find({ patientId }).sort({ orderedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving lab results' });
  }
};

// Create a new Lab Order
const createLabOrder = async (req, res) => {
  try {
    const { patientId, testType, priority } = req.body;

    if (!patientId || !testType) {
      return res.status(400).json({ message: 'patientId and testType are required' });
    }

    // Generate a unique orderId
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const newOrder = await LabResult.create({
      orderId,
      patientId,
      testType,
      priority: priority || 'Routine',
      status: 'Pending'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab order' });
  }
};

module.exports = { getResultsByPatientId, createLabOrder };
