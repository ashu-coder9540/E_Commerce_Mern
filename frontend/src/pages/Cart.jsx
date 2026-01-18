import React from "react";
import { FaTimes, FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import {
  deleteCartItem,
  fetchCart,
  saveCart,
  clearCart
} from "../features/cartSlice/cartSlice";
import { carttotalPrice } from "../features/cartSlice/cartSlice";
import { IncrementQuantity } from "../features/cartSlice/cartSlice";
import { DecrementQuantity } from "../features/cartSlice/cartSlice";
import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import loadRazorpay from "../utils/loadRazorpay";
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartAllValue = useSelector((state) => state.Cart);
  const cartData = useSelector((state) => state.Cart.cartItems);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle checkout process
  const handleCheckout = async () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Create order on our server
      const amountInPaise = Math.round(cartAllValue.TotalPrice * 100);
      
      const { data } = await axios.post('/api/payment/create-order', {
        amount: amountInPaise,
        currency: 'INR',
        items: cartData.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.productPrice
        }))
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // 2. Load Razorpay script
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      // 3. Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: data.order.id,
        handler: async function(response) {
          try {
            // 4. Verify payment on our server
            const verifyResponse = await axios.post('/api/payment/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            });

            if (verifyResponse.data.success) {
              // Clear cart on successful payment
              dispatch(clearCart());
              
              toast.success('Payment successful! Your order has been placed.');
              navigate('/order-success', { 
                state: { 
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id 
                } 
              });
            } else {
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name', // You can get this from user profile
          email: 'customer@example.com', // You can get this from user profile
          contact: '+919876543210' // You can get this from user profile
        },
        notes: {
          address: 'Customer Address' // You can get this from user profile
        },
        theme: {
          color: '#10B981' // Match your brand color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    dispatch(carttotalPrice());
  }, [cartData, dispatch]);
  useEffect(() => {

    let userId = localStorage.getItem("user");
    let token = localStorage.getItem("token");
    if (token && userId && cartData.length > 0) {
      dispatch(
        saveCart({
          userId: userId,
          cartItems: cartData,
          totalPrice: cartAllValue.TotalPrice,
          totalQuantity: cartAllValue.TotalQuantity,
        })
      );
    }
  }, [cartData, cartAllValue, dispatch]);

  useEffect(() => {
     let token = localStorage.getItem("token");
     let userId = localStorage.getItem("user");

     if(!token){
      toast.error("Please Login to access your cart");
      navigate("/login");
      return;
     }

     if(userId){
       dispatch(fetchCart(userId));
       setCheckingAuth(false);
     }else{
      setCheckingAuth(false);
     }
  }, [dispatch, navigate]);
  
  if(checkingAuth){
    return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        Loading Cart...
      </div>
    </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#fff] w-full max-w-xl p-6  rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh] mx-4">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-green-500 text-center mb-4">
          Your Cart🛒
        </h2>

        {cartData && cartData.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {cartData.map((value, index) => (
              <li key={value._id || index} className="flex items-center gap-5 py-4">
              <img
                src={`/uploads/${value.productImage}`}
                alt="ProductImage"
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-500">
                  {value.productName}
                </h3>

                <p className="text-sm text-gray-500">
                  ₹ {value.productPrice} each
                </p>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    className="px-2 py-1 bg-green-200 rounded hover:bg-green-400"
                    onClick={() => {
                      dispatch(DecrementQuantity(value));
                    }}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-2">{value.quantity}</span>
                  <button
                    className="px-2 py-1 bg-green-200 rounded hover:bg-green-400"
                    onClick={() => {
                      dispatch(IncrementQuantity(value));
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <p className="font-bold text-green-500">
                ₹{value.quantity * value.productPrice}
              </p>
              <MdDelete
                className="text-gray-500 hover:text-red-500 text-xl hover:cursor-pointer"
                onClick={() => {
                  dispatch(deleteCartItem(value));
                }}
              />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Total */}
        <div className="mt-6 text-right">
          <p className="text-lg font-semibold text-gray-800">
            Total:-{" "}
            <span className="text-green-500">₹{cartAllValue.TotalPrice}</span>
          </p>
          <button 
            onClick={handleCheckout}
            disabled={isProcessing || cartAllValue.TotalPrice === 0}
            className={`mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2 w-full ${(isProcessing || cartAllValue.TotalPrice === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin" />
                Processing...
              </>
            ) : 'Proceed to Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
