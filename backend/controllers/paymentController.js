 // Ensure env is loaded when this module is required
 const path = require('path');
 const dotenv = require('dotenv');
 dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
 dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

// @desc    Create a Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
// Initialize Razorpay with current environment variables
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay env missing:', {
      keyId: !!keyId,
      keySecret: !!keySecret
    });
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const razorpay = getRazorpayInstance();
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    const options = {
      amount: Math.round(amount), // amount in the smallest currency unit (paise for INR)
      currency: currency,
      receipt: receipt || `order_rcpt_${Date.now()}`,
      payment_capture: 1 // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    // Create order in database with pending status
    const newOrder = new Order({
      userId: req.user.id, // from auth middleware
      amount: amount,
      currency: currency,
      orderId: order.id,
      receipt: order.receipt,
      status: 'pending',
      items: req.body.items || [] // Array of cart items
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Verify payment signature and update order status
// @route   POST /api/payment/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order status in database
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: razorpay_order_id, userId: req.user.id },
      {
        paymentId: razorpay_payment_id,
        status: 'completed',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Here you can add additional logic like sending order confirmation email, etc.

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Optional: Webhook handler for Razorpay
// This is an example, you'll need to implement according to your needs
exports.webhookHandler = async (req, res) => {
  const { event, payload } = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  try {
    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        await Order.findOneAndUpdate(
          { paymentId: payload.payment.entity.id },
          { status: 'completed', updatedAt: Date.now() }
        );
        break;
        
      case 'payment.failed':
        // Handle failed payment
        await Order.findOneAndUpdate(
          { paymentId: payload.payment.entity.id },
          { status: 'failed', updatedAt: Date.now() }
        );
        break;
        
      // Add more event handlers as needed
    }
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
