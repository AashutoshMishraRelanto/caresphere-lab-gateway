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

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
