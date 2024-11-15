import React, { useContext, useState } from "react";
import { CartContext } from '../Cart/CartContext';
import { useLocation } from 'react-router-dom';
import './CheckoutForm.css'

const CheckForm = () => {
  const { shoppingCart, totalPrice } = useContext(CartContext);
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const cartItems = location.state?.cartItems || shoppingCart;
  const cartTotal = location.state?.totalPrice || totalPrice;

  const handleCheckout = async (event) => {
    event.preventDefault();
    
    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setCheckoutError('');

    try {
      const response = await fetch('http://localhost:5252/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          products: cartItems
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const { url } = await response.json();
      
      window.location.href = url;

    } catch (error) {
      console.error('Checkout Error:', error);
      setCheckoutError(
        error.message || 'Failed to process checkout. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkform-container">
      <div className="checkform-section">
        <h2 className="checkform-heading">Checkout Summary</h2>
        
        {checkoutError && (
          <div className="checkform-text error">
            {checkoutError}
          </div>
        )}
        
        {cartItems.length === 0 ? (
          <div className="checkform-text">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="checkform-products">
              {cartItems.map(item => (
                <div key={item.ProdID} className="checkform-product">
                  <img 
                    src={item.ProdImg || '/api/placeholder/80/80'} 
                    alt={item.ProdName}
                    className="checkform-image"
                  />
                  <div className="checkform-description">
                    <h3 className="checkform-heading">{item.ProdName}</h3>
                    <p className="checkform-text">By {item.designer}</p>
                    <h5 className="checkform-subheading">
                      CAD ${(item.ProdPrice * item.qty).toLocaleString()}
                    </h5>
                    <p className="checkform-text">Quantity: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <div className="checkout-total">
                <span className="checkform-heading">Total:</span>
                <span className="checkform-heading">
                  CAD ${cartTotal.toLocaleString()}
                </span>
              </div>
              <form onSubmit={handleCheckout}>
                <button 
                  type="submit"
                  className="checkform-button"
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Message = ({ message }) => (
  <section className="checkform-section">
    <p className="checkform-text">{message}</p>
  </section>
);

export { CheckForm };