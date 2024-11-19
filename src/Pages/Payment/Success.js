import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ref, push, get, serverTimestamp } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../Config/Firebase'; // Import directly from your config file
import './Success.css';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateUniqueOrderId = async () => {
    try {
      // Get all existing orders
      const ordersRef = ref(db, 'orders');
      const ordersSnapshot = await get(ordersRef);
      const orders = ordersSnapshot.val() || {};
  
  
      let maxOrderNumber = 100000; // Start from 100000 to ensure 6 digits without leading zeros
      Object.values(orders).forEach(order => {
        if (!order.orderId.startsWith('00')) {
          const numberPart = parseInt(order.orderId, 10);
          if (!isNaN(numberPart) && numberPart > maxOrderNumber) {
            maxOrderNumber = numberPart;
          }
        }
      });
  
      // Generate new number (will be 6 digits without leading zeros)
      return (maxOrderNumber + 1).toString();
    } catch (error) {
      console.error('Error generating unique order ID:', error);
      throw error;
    }
  };
  const createOrder = async (session) => {
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const ordersRef = ref(db, 'orders');
    const orderNumber = await generateUniqueOrderId();
    ;

    const orderData = {
      orderId: orderNumber,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      orderDate: serverTimestamp(),
      products: session.line_items.data.map(item => ({
        productId: item.price.product,
        name: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        subtotal: (item.price.unit_amount * item.quantity) / 100
      })),
      payment: {
        sessionId: session.id,
        status: session.payment_status,
        amount: session.amount_total / 100,
        currency: session.currency,
        created: new Date(session.created * 1000).toISOString()
      },
      orderStatus: 'processing',
      totalAmount: session.amount_total / 100,
      metadata: {
        createdAt: serverTimestamp(),
        platform: 'web'
      }
    };

    await push(ordersRef, orderData);
    return orderData;
  };

  const checkExistingOrder = async (sessionId) => {
    const ordersRef = ref(db, 'orders');
    const ordersSnapshot = await get(ordersRef);
    const orders = ordersSnapshot.val();

    if (!orders) return null;

    return Object.values(orders).find(
      order => order.payment?.sessionId === sessionId
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (!user) {
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        navigate('/login');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId && !location.state?.orderNumber) {
          navigate('/');
          return;
        }

        if (sessionId) {
          const existingOrder = await checkExistingOrder(sessionId);

          if (existingOrder) {
            setOrderInfo({
              email: existingOrder.userEmail,
              orderNumber: existingOrder.orderId,
              totalAmount: existingOrder.totalAmount
            });
          } else {
            const response = await fetch(`/checkout-session/${sessionId}`);
            const session = await response.json();

            const orderData = await createOrder(session);

            await fetch('/mark-session-processed', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionId }),
            });

            setOrderInfo({
              email: user.email,
              orderNumber: orderData.orderId,
              totalAmount: orderData.totalAmount
            });
          }
        } else {
          setOrderInfo(location.state);
        }
      } catch (error) {
        console.error('Error processing order:', error);
        navigate('/error', {
          state: { 
            message: 'There was an error processing your order. Please contact support.' 
          }
        });
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
          <div className="loading-spinner">Loading...</div>
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
          <p>Order number: #{orderInfo.orderNumber}</p>
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