import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../Cart/CartContext';
import './Success.css';

const Success = () => {

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
          <p>An email confirmation has been sent to your inbox.</p>
          <p>Order number: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
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