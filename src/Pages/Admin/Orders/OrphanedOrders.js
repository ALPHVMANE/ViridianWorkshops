// import { ref, get, push, serverTimestamp } from 'firebase/database';
// import React, { useState, useEffect } from 'react';
// import { db } from '../../../Config/Firebase';
// import checkUserRole from '../../../Utilities/CheckUserRole';
// import Swal from 'sweetalert2';

// const generateOrderId = async () => {
//   try {
//     const ordersRef = ref(db, 'orders');
//     const ordersSnapshot = await get(ordersRef);
//     const orders = ordersSnapshot.val() || {};
    
//     let maxNumber = 0;
//     Object.values(orders).forEach(order => {
//       if (order.orderNumber.startsWith('00')) {
//         const numberPart = parseInt(order.orderNumber.slice(3), 10);
//         if (!isNaN(numberPart) && numberPart > maxNumber) {
//           maxNumber = numberPart;
//         }
//       }
//     });

//     return `00${(maxNumber + 1).toString().padStart(6, '0')}`;
//   } catch (error) {
//     console.error('Error generating order ID:', error);
//     throw error;
//   }
// };

// const createOrder = async (session, adminUserId) => {
//   try {
//     const ordersRef = ref(db, 'orders');
//     const orderNumber = await generateOrderId();

//     const orderData = {
//       orderNumber,
//       userId: session.paymentIntentId || 'unknown',
//       userEmail: session.customer_details?.email || 'N/A',
//       orderDate: serverTimestamp(),
//       products: session.line_items?.map(item => ({
//         productId: item.price?.product || 'unknown',
//         name: item.description,
//         quantity: item.quantity,
//         price: item.price?.unit_amount / 100,
//         subtotal: (item.price?.unit_amount * item.quantity) / 100
//       })) || [],
//       payment: {
//         sessionId: session.sessionId,
//         status: 'completed', 
//         amount: session.amount,
//         currency: 'cad', // Default to CAD
//         created: session.created,
//         paymentIntentId: session.paymentIntentId,
//         refunded: false,
//         refundAmount: 0
//       },
//       status: 'completed', 
//       orderStatus: 'pending',
//       totalAmount: session.amount,
//       metadata: {
//         createdAt: serverTimestamp(),
//         platform: 'web',
//         isOrphaned: true,
//         recoveredAt: serverTimestamp(),
//         recoveredBy: adminUserId,
//         orderType: 'orphaned'
//       }
//     };

//     const newOrderRef = await push(ordersRef, orderData);
//     return { ...orderData, key: newOrderRef.key };
//   } catch (error) {
//     console.error('Error creating order:', error);
//     throw error;
//   }
// };

// const CheckOrderTransaction = () => {
//   const [username, setUsername] = useState('');
//   const [role, setRole] = useState('');

//   useEffect(() => {
//     const unsubscribe = checkUserRole(setUsername, setRole);
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const checkTransactions = async () => {
//       if (role !== 'admin') {
//         Swal.fire({
//           title: 'Error',
//           text: 'Unauthorized: Admin privileges required',
//           icon: 'error'
//         });
//         return;
//       }

//       try {
//         // Get existing orders from Firebase
//         const ordersRef = ref(db, 'orders');
//         const ordersSnapshot = await get(ordersRef);
//         const existingOrders = ordersSnapshot.val() || {};

//         // Fetch sessions from backend
//         const baseUrl = process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, '');
//         const response = await fetch(`${baseUrl}/payment-status/check`);
        
//         if (!response.ok) {
//           throw new Error(`Server error: ${response.status}`);
//         }

//         const { sessions } = await response.json();
//         const orphanedSessions = [];
//         const processedSessions = [];

//         // Check for orphaned sessions
//         for (const session of sessions) {
//           if (session.status === 'succeeded') {
//             const hasOrder = Object.values(existingOrders).some(
//               order => order.payment?.sessionId === session.sessionId
//             );

//             if (!hasOrder) {
//               orphanedSessions.push(session);
//               try {
//                 const orderData = await createOrder(session, username);
//                 processedSessions.push(session.sessionId);
//               } catch (orderError) {
//                 console.error('Error creating order for session', session.sessionId, orderError);
//               }
//             }
//           }
//         }

//         Swal.fire({
//           title: 'Success',
//           text: `Found ${orphanedSessions.length} orphaned orders, processed ${processedSessions.length}`,
//           icon: 'success'
//         });

//       } catch (error) {
//         Swal.fire({
//           title: 'Error',
//           text: error.message,
//           icon: 'error'
//         });
//       }
//     };

//     if (role === 'admin') {
//       checkTransactions();
//     }
//   }, [role, username]);

//   return null;
// };

// export default CheckOrderTransaction;