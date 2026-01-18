# E_COMMERCE_MERN (Frontend)

A React + Vite frontend for the MERN e-commerce app with JWT auth, cart persistence, and Razorpay payments.

## Tech Stack
- React (Vite)
- Redux Toolkit
- Axios
- React Hot Toast

Backend services are provided by the Express API running at http://localhost:5000 (proxied via Vite during development).

## Project Structure (Frontend)
```
frontend/
├─ vite.config.js          # dev proxy to backend
└─ src/
   ├─ pages/
   │  └─ Cart.jsx         # checkout flow + Razorpay UI
   ├─ features/cartSlice/
   │  └─ cartSlice.js     # Redux cart slice (clearCart, saveCart, fetchCart, etc.)
   └─ utils/
      └─ loadRazorpay.js  # dynamic loader for Razorpay checkout script
```

## Environment Variables (Root/Backend)
The backend loads env from `backend/.env` (recommended) or project root `.env`. Ensure these exist before running the frontend:

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/eshop

JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=30d

RAZORPAY_KEY_ID=<rzp_test_xxx>
RAZORPAY_KEY_SECRET=<your_test_secret>

FRONTEND_URL=http://localhost:5173
# Optional: RAZORPAY_WEBHOOK_SECRET=<your_webhook_secret>
```

Notes:
- Do not quote values.
- Test keys start with `rzp_test_`. Use live keys only in production.

## Installation
Install dependencies from inside `frontend/`:

```
cd frontend
npm install
```

## Running the Frontend
Start the dev server (Vite):

```
npm run dev
```

This runs at http://localhost:5173 with a dev proxy to the backend for `/api` and `/uploads`. See `vite.config.js`:

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5000/' },
      '/uploads': { target: 'http://localhost:5000/' },
    }
  }
})
```

## Checkout Flow (Razorpay)
Implemented in `src/pages/Cart.jsx`:

1) Compute `amountInPaise = Math.round(totalPrice * 100)`.
2) POST `/api/payment/create-order` to obtain `{ key, order }`.
3) Load Razorpay script via `loadRazorpay()` and open Checkout.
4) In handler callback, POST `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` to `/api/payment/verify-payment`.
5) On success, dispatch `clearCart()` and navigate to a success page. Toasts are shown for success/failure.

## Cart APIs (used by this frontend)
The frontend interacts with these endpoints (JWT required):

- POST `/api/cart/save` – persists the cart for the current user
- GET `/api/cart/:userId` – fetches the saved cart for the user

Headers:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

## Example Payment cURL (for backend testing)
Replace `<TOKEN>` with a valid JWT.

Create Order:
```
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 12300, "currency": "INR", "items": [] }'
```

Verify Payment:
```
curl -X POST http://localhost:5000/api/payment/verify-payment \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "razorpay_order_id":"order_ABC","razorpay_payment_id":"pay_DEF","razorpay_signature":"<sig>" }'
```

## Testing with Razorpay (Test Mode)
1) Set test keys in `.env`.
2) Start backend and frontend.
3) Add products to cart, click “Proceed to Pay”.
4) Use test card: `4111 1111 1111 1111` (any future expiry, any CVV).
5) On success, server returns success from `/verify-payment` and UI clears cart.

## Troubleshooting
- 500 on `/api/payment/create-order` with “Razorpay credentials not configured”:
  - Ensure env exists in `backend/.env` or project root `.env` with `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
  - Restart backend after changes.
  - Backend `app.js` logs: `Razorpay Key ID: Set/Not set`.
  - Controller logs indicate which variable is missing.

- Requests show `http://localhost:5173/api/...`:
  - This is proxied to `http://localhost:5000` via `vite.config.js`. Ensure backend is running.

- Cart does not clear after payment:
  - Confirm `clearCart` export exists in `src/features/cartSlice/cartSlice.js`.

- CORS issues:
  - Verify `FRONTEND_URL` in env and CORS config in backend `app.js`.

## Production Notes
- Use live Razorpay keys and HTTPS.
- Set `NODE_ENV=production`.
- Configure webhooks with `RAZORPAY_WEBHOOK_SECRET`.
- Do not log secrets; harden JWT and rate-limit sensitive endpoints.

## Scripts
- `npm run dev` – Vite dev server on http://localhost:5173