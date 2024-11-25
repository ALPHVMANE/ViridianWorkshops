// src/utils/AdminTransactions.js
import { ref, get, push, serverTimestamp } from 'firebase/database';
import { db } from '../../../Config/Firebase';

const generateOrphanedOrderId = async () => {
  try {
    // Get all existing orders
    const ordersRef = ref(db, 'orders');
    const ordersSnapshot = await get(ordersRef);
    const orders = ordersSnapshot.val() || {};

    // Find the highest orphaned order number
    let maxOrphanNumber = 0;
    Object.values(orders).forEach(order => {
      if (order.orderId.startsWith('00')) {
        const numberPart = parseInt(order.orderId.slice(3), 10);
        if (!isNaN(numberPart) && numberPart > maxOrphanNumber) {
          maxOrphanNumber = numberPart;
        }
      }
    });

    // Generate new number and pad it
    const newNumber = (maxOrphanNumber + 1).toString().padStart(6, '0');
    return `00${newNumber}`;
  } catch (error) {
    console.error('Error generating orphaned order ID:', error);
    throw error;
  }
};

const checkAdminRole = async (userId) => {
  try {
    const userRoleRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRoleRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

export const CheckOrphanedTransactions = async (currentUser) => {
  try {
    // Verify admin privileges by checking database
    const isAdmin = await checkAdminRole(currentUser.uid);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin privileges required');
    }

    // Get all orders from Firebase
    const ordersRef = ref(db, 'orders');
    const ordersSnapshot = await get(ordersRef);
    const existingOrders = ordersSnapshot.val() || {};

    // Get recent sessions from Stripe (last 7 days)
    const response = await fetch('/checkout-session/recent');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const sessions = await response.json();

    const orphanedSessions = [];
    const processedSessions = [];

    // Check each session
    for (const session of sessions) {
      if (session.payment_status === 'paid') {
        // Check if we already have an order for this session
        const hasOrder = Object.values(existingOrders).some(
          order => order.payment?.sessionId === session.id
        );

        if (!hasOrder) {
          console.log(`Found orphaned transaction: ${session.id}`);
          orphanedSessions.push(session);
          
          // Create order for orphaned transaction
          await createOrphanedOrder(session, currentUser.uid);
          processedSessions.push(session.id);
        }
      }
    }

    return {
      success: true,
      found: orphanedSessions.length,
      processed: processedSessions,
      orphanedSessions
    };

  } catch (error) {
    console.error('Error checking orphaned transactions:', error);
    return {
      success: false,
      error: error.message,
      found: 0,
      processed: []
    };
  }
};

const createOrphanedOrder = async (session, adminUserId) => {
  try {
    const ordersRef = ref(db, 'orders');
    // Generate unique orphaned order ID starting with '000'
    const orderNumber = await generateOrphanedOrderId();

    // Try to get user data if customer email exists
    let userData = null;
    if (session.customer_details?.email) {
      const usersRef = ref(db, 'users');
      const usersSnapshot = await get(usersRef);
      const users = usersSnapshot.val() || {};
      userData = Object.values(users).find(
        user => user.email === session.customer_details.email
      );
    }

    const orderData = {
      orderId: orderNumber, // Will be like '000000001', '000000002', etc.
      userId: userData?.uid || session.customer,
      userEmail: userData?.email || session.customer_details?.email,
      orderDate: serverTimestamp(),
      products: session.line_items.data.map(item => ({
        productId: item.price.product,
        name: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        subtotal: (item.price.unit_amount * item.quantity) / 100
      })),
      payment: {
        sessionId: session.id,
        status: session.payment_status,
        amount: session.amount_total / 100,
        currency: session.currency,
        created: new Date(session.created * 1000).toISOString()
      },
      orderStatus: 'processing',
      totalAmount: session.amount_total / 100,
      metadata: {
        createdAt: serverTimestamp(),
        platform: 'web',
        isOrphaned: true,
        recoveredAt: serverTimestamp(),
        recoveredBy: adminUserId,
        orderType: 'orphaned'
      }
    };

    await push(ordersRef, orderData);
    return orderData;
  } catch (error) {
    console.error('Error creating orphaned order:', error);
    throw error;
  }
};
export default CheckOrphanedTransactions;