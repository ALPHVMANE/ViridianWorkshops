import { getDatabase, ref, set } from 'firebase/database';

const saveOrderToDatabase = async (session) => {
  try {
    const db = getDatabase();
    const orderId = session.metadata.orderId;
    
    await set(ref(db, `orders/${orderId}`), {
      orderId: orderId,
      stripePaymentIntentId: session.payment_intent,
      amount: session.amount_total,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      paymentMethod: session.payment_method_types[0],
      created: new Date().toISOString(),
      items: session.line_items.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        price: item.amount_total
      }))
    });
  } catch (error) {
    console.error('Error saving order to database:', error);
    throw error;
  }
};