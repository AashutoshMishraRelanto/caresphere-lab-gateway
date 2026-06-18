const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const labRoutes = require('./routes/labRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/labs', labRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Temporary Seed Route
app.get('/seed-database-1234', async (req, res) => {
  try {
    const { seedDB } = require('./utils/seed');
    const result = await seedDB();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
