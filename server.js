const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);
const app = express();

const getBaseUrl = (url) => {
  console.log('Incoming URL:', url); // Debug log
  
  if (!url) {
    console.log('No URL provided, using default');
    return 'http://localhost:3000';
  }
  
  try {
    // Validate URL format
    new URL(url);
    return url.endsWith('/') ? url.slice(0, -1) : url;
  } catch (error) {
    console.error('Invalid URL format:', error);
    return 'http://localhost:3000';
  }
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

console.log('====================================');
console.log('SECRET_STRIPE_KEY:', process.env.REACT_APP_STRIPE_SECRET_KEY ? '✅ Found' : '❌ Not Found');
console.log('====================================');

const sessionsStore = new Map();

// Helper function to format currency
const formatCurrency = (amount, currency = 'cad') => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

// Helper function to log order details
const logOrderDetails = (session, products) => {
  console.log('\n📦 ORDER DETAILS');
  console.log('====================================');
  console.log('Session ID:', session.id);
  console.log('Date:', new Date().toLocaleString());
  
  if (products && products.length > 0) {
    console.log('\nProducts:');
    products.forEach((item, index) => {
      console.log(`\nItem ${index + 1}:`);
      console.log(`Name: ${item.ProdName}`);
      console.log(`Designer: ${item.designer}`);
      console.log(`Price: $${item.ProdPrice}`);
      console.log(`Quantity: ${item.qty}`);
    });
  }
  console.log('====================================\n');
};

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { products } = req.body;
    
    console.log('\n🛒 New Checkout Started');

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

    const baseUrl = getBaseUrl(process.env.REACT_APP_FRONTEND_URL);
    console.log('Base URL:', baseUrl);

    const successUrl = new URL('/success', baseUrl).toString();
    const cancelUrl = new URL('/cart-products', baseUrl).toString();
    
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    logOrderDetails(session, products);
    console.log('Payment Link:', session.url);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get session details
app.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });

    console.log('\n✅ Payment Status Check');
    console.log('====================================');
    console.log('Session ID:', sessionId);
    console.log('Payment Status:', session.payment_status);
    console.log('Customer:', session.customer_details?.email);
    console.log('====================================\n');

    res.json(session);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});



// Get recent sessions + payment
app.get('/payment-status/check', async (req, res) => {
  try {
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);

    const paymentIntents = await stripe.paymentIntents.list({
      created: { gte: sevenDaysAgo },
      limit: 100,
      expand: ['data.payment_method']
    });

    const sessions = await Promise.all(
      paymentIntents.data.map(async pi => {
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: pi.id,
            expand: ['data.line_items', 'data.customer_details']
          });
          
          const sessionDetails = await stripe.checkout.sessions.retrieve(
            sessions.data[0]?.id,
            {
              expand: ['line_items.data.price.product', 'customer_details']
            }
          );

          return {
            paymentIntentId: pi.id,
            sessionId: sessionDetails?.id,
            amount: pi.amount / 100,
            status: pi.status,
            created: new Date(pi.created * 1000).toLocaleString(),
            currency: pi.currency,
            customer_details: sessionDetails?.customer_details,
            line_items: sessionDetails?.line_items?.data.map(item => ({
              description: item.price?.product?.name,
              price: {
                unit_amount: item.price?.unit_amount,
                product: item.price?.product?.id
              },
              quantity: item.quantity
            }))
          };
        } catch (err) {
          console.error(`Error with payment intent ${pi.id}:`, err);
          return null;
        }
      })
    );

    res.json({
      total_payments: paymentIntents.data.length,
      sessions: sessions.filter(Boolean)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5252, () => console.log(`Running on port 5252 (ctrl + click): ${process.env.REACT_APP_BACKEND_URL}`));