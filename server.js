//npm install cors express dotenv stripe
//to run the server through terminal: node server.js

const path = require('path');  // This needs to come first
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🚀 Starting server...');
console.log('📂 Current directory:', __dirname);

const express = require("express");
const cors = require("cors");
const app = express();

// Log the environment variables (remove in production)
console.log('====================================');
console.log('Environment Check:');
console.log('SECRET_STRIPE_KEY:', process.env.REACT_APP_STRIPE_SECRET_KEY ? '✅ Found' : '❌ Not Found');
console.log('====================================');

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static("public"));

app.post("/api/checkout", async (req, res) => {
  try {
    const { products } = req.body;
    
    const lineItems = products.map(item => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.ProdName,
          description: `Designer: ${item.designer}`,
          images: item.ProdImg ? [item.ProdImg] : [],
        },
        unit_amount: Math.round(item.ProdPrice * 100),
      },
      quantity: item.qty,
    }));
    
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

// Your routes...
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  });
});

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalPrice, products } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe expects amount in cents
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5252;
const server = app.listen(PORT, () => {
  console.log('====================================');
  console.log(`✨ Server is running!`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('====================================');
}).on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
});