import React, { useState, useEffect } from "react";

const ProductDisplay = ({ cartItems }) => {
  const handleCheckout = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5252/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          products: cartItems || [{
            ProdName: "Stubborn Attachments",
            designer: "Default Designer",
            ProdPrice: 20.00,
            ProdImg: "https://i.imgur.com/EHyR2nP.png",
            qty: 1
          }]
        })
      });

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </div>
      <form onSubmit={handleCheckout}>
        <button type="submit">
          Checkout
        </button>
      </form>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState(null);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }

    // Load cart items from your storage (localStorage, Redux, etc.)
    // This is just an example - replace with your actual cart data source
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    loadCartItems();
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay cartItems={cartItems} />
  );
}