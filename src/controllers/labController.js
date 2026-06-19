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

    // AUTO-COMPLETE BOT (Simulates the Lab Technician working)
    setTimeout(async () => {
      try {
        let mockResult = 'Result: Normal';
        if (testType === 'Complete Blood Count') mockResult = 'WBC: 5.4, RBC: 4.8';
        if (testType === 'Lipid Panel') mockResult = 'Cholesterol: 180, LDL: 100';
        if (testType === 'Urinalysis') mockResult = 'Color: Pale Yellow, Clarity: Clear';
        if (testType === 'COVID-19 PCR') mockResult = 'Result: Negative';
        if (testType === 'Comprehensive Metabolic Panel') mockResult = 'Glucose: 90, Calcium: 9.2';
        if (testType === 'HbA1c') mockResult = 'Result: 5.2%';

        await LabResult.findByIdAndUpdate(newOrder._id, {
          status: 'Completed',
          resultValue: mockResult,
          dateCollected: new Date().toISOString()
        });
        console.log(`Auto-completed lab order ${orderId} for ${testType}`);
      } catch(err) {
        console.error("Auto-complete failed", err);
      }
    }, 15000); // 15 seconds

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab order' });
  }
};

module.exports = { getResultsByPatientId, createLabOrder };
