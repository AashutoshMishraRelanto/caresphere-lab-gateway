const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Routine', 'High', 'STAT'],
    default: 'Routine'
  },
  results: {
    value: String,
    unit: String,
    referenceRange: String,
    isAbnormal: Boolean,
    notes: String
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

// Index for faster queries
labResultSchema.index({ patientId: 1 });
labResultSchema.index({ orderId: 1 });

module.exports = mongoose.model('LabResult', labResultSchema);
