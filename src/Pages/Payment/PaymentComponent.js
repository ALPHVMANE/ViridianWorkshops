import React, { useEffect, useState } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import './styles/payment.css';

const Payment = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  // Debug log for environment variable
  console.log("Environment variable:", {
    REACT_APP_STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  });

  useEffect(() => {
    // Fetch publishable key from server
    const getConfig = async () => {
      try {
        console.log("Fetching config from server...");
        const response = await fetch("/config");
        const { publishableKey } = await response.json();
        console.log("Received publishable key:", publishableKey);
        
        if (publishableKey) {
          console.log("Initializing Stripe with key:", publishableKey);
          setStripePromise(loadStripe(publishableKey));
        } else {
          console.error("No publishable key received from server");
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };

    getConfig();
  }, []);

  useEffect(() => {
    // Create payment intent
    const getClientSecret = async () => {
      try {
        console.log("Creating payment intent...");
        const response = await fetch("/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        
        const data = await response.json();
        console.log("Received client secret response:", {
          success: !!data.clientSecret,
          error: data.error
        });
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
      }
    };

    getClientSecret();
  }, []);

  console.log("Render state:", {
    hasStripePromise: !!stripePromise,
    hasClientSecret: !!clientSecret
  });

  return (
    <div className="payment-container">
      <h1>React Stripe and the Payment Element</h1>
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