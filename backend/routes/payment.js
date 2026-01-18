const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhookHandler } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Protected routes - require authentication
router.post('/create-order', auth, createOrder);
router.post('/verify-payment', auth, verifyPayment);

// Webhook endpoint - doesn't require auth but verifies signature
router.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

module.exports = router;
