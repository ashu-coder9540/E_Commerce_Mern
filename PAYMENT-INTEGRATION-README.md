# Razorpay Payment Integration

This document provides instructions for setting up and testing the Razorpay payment integration in the MERN e-commerce application.

## Prerequisites

1. Node.js (v14 or higher)
2. MongoDB
3. Razorpay account (test mode)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory and copy the contents from `.env.example`. Then update the following variables:

```env
# Razorpay Test Credentials (get from Razorpay Dashboard)
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

# JWT Secret (generate a strong secret)
JWT_SECRET=your_strong_jwt_secret

# Frontend URL (update if your frontend runs on a different port)
FRONTEND_URL=http://localhost:5173
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install razorpay

# Install frontend dependencies
cd ../frontend
npm install axios react-hot-toast
```

### 3. Run the Application

#### Backend

```bash
cd backend
npm run serverRun
```

The backend will start on `http://localhost:5000` by default.

#### Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` by default.

## Testing the Integration

### 1. Test Razorpay Checkout

1. Add items to your cart
2. Click on "Proceed to Pay"
3. You'll be redirected to the Razorpay test payment page
4. Use the following test card details:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

### 2. Test Webhook (Optional)

For production, set up a webhook in your Razorpay Dashboard to point to:
`https://yourdomain.com/api/payment/webhook`

## API Endpoints

### Create Order
```
POST /api/payment/create-order
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 10000, // amount in paise (10000 = ₹100)
  "currency": "INR",
  "items": [
    {
      "productId": "product123",
      "quantity": 2,
      "price": 5000
    }
  ]
}
```

### Verify Payment
```
POST /api/payment/verify-payment
Content-Type: application/json
Authorization: Bearer <token>

{
  "razorpay_order_id": "order_123",
  "razorpay_payment_id": "pay_123",
  "razorpay_signature": "generated_signature"
}
```

## Troubleshooting

1. **Payment verification fails**
   - Ensure your server time is synchronized (Razorpay is time-sensitive)
   - Verify your RAZORPAY_KEY_SECRET is correct
   - Check server logs for detailed error messages

2. **CORS issues**
   - Ensure FRONTEND_URL in .env matches your frontend URL exactly
   - Restart the backend after changing environment variables

3. **Test card not working**
   - Make sure you're using Razorpay test keys (starts with 'rzp_test_')
   - Check the browser console for JavaScript errors

## Security Considerations

1. Never expose your Razorpay key secret in client-side code
2. Always verify payment signatures on the server
3. Use environment variables for all sensitive data
4. Implement proper error handling and logging
5. Enable webhook verification in production

## Production Deployment

1. Replace test keys with live keys from Razorpay Dashboard
2. Set NODE_ENV=production
3. Configure proper SSL certificates
4. Set up monitoring and alerts
5. Implement proper logging and error tracking
