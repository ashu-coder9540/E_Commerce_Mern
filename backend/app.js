 const path = require('path');
 const dotenv = require('dotenv');
 // Load env from backend/.env then fallback to repo root .env
 dotenv.config({ path: path.resolve(__dirname, '.env') });
 dotenv.config({ path: path.resolve(__dirname, '../.env') });
 console.log('Environment:', process.env.NODE_ENV || 'development');
 console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');
 const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const apiRouter = require("./routes/api");
const paymentRouter = require('./routes/payment');

// Database connection
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eshop")
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// API Routes
app.use("/api", apiRouter);
app.use("/api/payment", paymentRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});