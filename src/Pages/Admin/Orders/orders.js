import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, push, serverTimestamp } from 'firebase/db';
import { db } from '../../../Config/Firebase';
import { CartContext } from '../Cart/CartContext';
import { AuthContext } from '../Auth/AuthContext';

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, totalAmount } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  const getStripeSessionDetails = async (sessionId) => {
    try {
      const response = await fetch(`/checkout-session/${sessionId}`);
      const sessionDetails = await response.json();
      return sessionDetails;
    } catch (error) {
      console.error('Error fetching session details:', error);
      throw error;
    }
  };

  const createOrder = async () => {
    try {
      // Get session ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        throw new Error('No session ID found');
      }

      // Fetch session details from Stripe
      const sessionDetails = await getStripeSessionDetails(sessionId);

      // Reference to the orders node in the db
      const ordersRef = ref(db, 'orders');

      // Generate unique order ID
      const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

      // Create order object with Stripe session details
      const orderData = {
        orderId: orderNumber,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        orderDate: serverTimestamp(),
        products: sessionDetails.line_items.data.map(item => ({
          productId: item.price.product,
          name: item.description,
          quantity: item.quantity,
          price: item.price.unit_amount / 100, // Convert from cents to dollars
          subtotal: (item.price.unit_amount * item.quantity) / 100
        })),
        payment: {
          sessionId: sessionId,
          paymentIntentId: sessionDetails.payment_intent,
          status: sessionDetails.payment_status,
          amount: sessionDetails.amount_total / 100, // Convert from cents to dollars
          currency: sessionDetails.currency,
          created: new Date(sessionDetails.created * 1000).toISOString()
        },
        orderStatus: 'processing',
        totalAmount: sessionDetails.amount_total / 100,
        metadata: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          platform: 'web',
          userAgent: navigator.userAgent
        }
      };

      // Push the order to Firebase
      await push(ordersRef, orderData);

      // Mark the session as processed
      await fetch('/mark-session-processed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      // Store order number in localStorage for reference
      localStorage.setItem('lastOrderNumber', orderNumber);

      // Navigate to success page with order details
      navigate('/success', { 
        state: { 
          orderNumber,
          totalAmount: orderData.totalAmount,
          email: currentUser.email 
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      navigate('/error', {
        state: { 
          message: 'There was an error processing your order. Please contact support.' 
        }
      });
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    createOrder();
  }, []);

  return null;
};

export default Order;