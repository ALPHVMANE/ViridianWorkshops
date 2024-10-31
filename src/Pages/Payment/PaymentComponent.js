import React, { useEffect, useState } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import './styles/payment.css';

const Payment = ({ totalPrice }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const { clientSecret, totalAmount, orderDetails } = state;

  // Debug log for environment variable
  console.log("Environment variable:", {
    REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  });

  useEffect(() => {
    // Fetch publishable key from server
    const getConfig = async () => {
      try {
        console.log("Fetching config from server...");
        const response = await fetch("http://localhost:5252/config");
        const { publishableKey } = await response.json();
        console.log("Received publishable key:", publishableKey);
        
        if (publishableKey) {
          setStripePromise(loadStripe(publishableKey));
          console.log("Initializing Stripe with key:", publishableKey);
        } else {
          console.error("No publishable key received from server");
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };

    getConfig();
  }, []);
    
  console.log("Render state:", {
    hasStripePromise: !!stripePromise,
  });

  return (
    <div className="payment-container">
      <h1>React Stripe and the Payment Element</h1>
      <div>Total Amount: ${totalAmount}</div> 
      {clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Payment;