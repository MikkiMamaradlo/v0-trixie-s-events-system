const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/services', require('./routes/services'));
  app.use('/api/inventory', require('./routes/inventory'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/payments', require('./routes/payments'));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'Backend is running', 
      database: 'MongoDB connected',
      timestamp: new Date().toISOString() 
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB Compass: mongodb://localhost:27017/trixtech`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
  });
}).catch(error => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

module.exports = app;
