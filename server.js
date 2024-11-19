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
    const { totalPrice, products } = req.body;
    
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
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Add session_id
      cancel_url: `${process.env.FRONTEND_URL}/cart-products`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });
    res.json(session);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/checkout-session/recent', async (req, res) => {
  try {
    // Get sessions from the last 7 days
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
    
    const sessions = await stripe.checkout.sessions.list({
      created: { gte: sevenDaysAgo },
      limit: 100, // Adjust this limit if you expect more transactions
      expand: ['line_items']
    });

    res.json(sessions.data);
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(5252, () => console.log(`Running on port 5252 (ctrl + click): ${process.env.BACKEND_URL}`));

