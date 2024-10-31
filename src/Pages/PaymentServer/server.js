const express = require("express");
const cors = require("cors");
const app = express();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static("public"));

// Get Stripe publishable key
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  });
});

// Create checkout session
app.post("/api/checkout", async (req, res) => {
  try {
    const { products } = req.body;
    
    // Create line items from cart products
    const lineItems = products.map(item => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.ProdName,
          description: `Designer: ${item.designer}`,
          images: item.ProdImg ? [item.ProdImg] : [],
        },
        unit_amount: Math.round(item.ProdPrice * 100), // Convert to cents
      },
      quantity: item.qty,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5252;
app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);