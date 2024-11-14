//npm install cors express dotenv stripe
//to run the server through terminal: node server.js

const path = require('path');  // This needs to come first
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('📂 Current directory:', __dirname);

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

console.log('====================================');
console.log('SECRET_STRIPE_KEY:', process.env.REACT_APP_STRIPE_SECRET_KEY ? '✅ Found' : '❌ Not Found');
console.log('====================================');


app.post('/create-checkout-session', async (req, res) => {
  try {
    const { products } = req.body;
    
    // Log the incoming cart data
    console.log('Cart Data Received:', products);

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
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONT_END}/success`,
      cancel_url: `${process.env.FRONT_END}/cart`,
    });

    // Instead of redirecting, send the URL back to the client
    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5252, () => console.log(`Running on port 5252 (ctrl + click): ${process.env.BACKEND_URL}`));

