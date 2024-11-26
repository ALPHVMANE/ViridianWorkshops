import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ref, push, serverTimestamp } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../Config/Firebase';
import './Success.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5252';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
          console.error('No session ID found in URL');
          navigate('/');
          return;
        }

        console.log('Fetching session details for:', sessionId);
        
        // Get session details from Stripe with error handling
        const response = await fetch(`${BACKEND_URL}/checkout-session/${sessionId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch session');
        }

        const session = await response.json();
        console.log('Session data received:', session);

        if (!session || !session.payment_intent) {
          throw new Error('Invalid session data received');
        }

        // Create order in Firebase with try-catch
        try {
          const ordersRef = ref(db, 'orders');
          const orderData = {
            userId: user.uid,
            userEmail: user.email,
            orderDate: serverTimestamp(),
            payment: {
              sessionId: session.id,
              status: session.payment_status,
              amount: session.amount_total / 100,
              currency: session.currency
            },
            products: session.line_items.data.map(item => ({
              name: item.description || item.price?.product?.name,
              quantity: item.quantity,
              price: (item.amount_total || item.price?.unit_amount) / 100
            })),
            status: 'completed',
            orderNumber: `ORD-${Date.now()}`
          };

          await push(ordersRef, orderData);
          console.log('Order created in Firebase:', orderData.orderNumber);

          setOrderInfo({
            email: user.email,
            orderNumber: orderData.orderNumber,
            totalAmount: session.amount_total / 100
          });
        } catch (firebaseError) {
          console.error('Firebase Error:', firebaseError);
          throw new Error('Failed to save order details');
        }

      } catch (error) {
        console.error('Error processing order:', error);
        setError(error.message);
        // Don't navigate away immediately, show error in UI
        setOrderInfo(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="loading-spinner">Processing your order...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-container">
        <div className="success-card error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <div className="success-actions">
            <Link to="/contact" className="success-button primary">
              Contact Support
            </Link>
            <Link to="/" className="success-button secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderInfo) return null;

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="success-details">
          <p>An email confirmation has been sent to {orderInfo.email}</p>
          <p>Order number: {orderInfo.orderNumber}</p>
          <p>Total amount: ${orderInfo.totalAmount.toFixed(2)}</p>
        </div>

        <div className="success-actions">
          <Link to="/" className="success-button primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="success-button secondary">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;