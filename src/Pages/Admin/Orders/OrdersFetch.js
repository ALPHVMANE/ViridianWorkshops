// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import { ref, onValue, update, get } from 'firebase/database';
// import { db, auth } from '../../../Config/Firebase';
// import OrdersTable from './OrdersTable';

// // Admin role check function
// const checkAdminRole = async (userId) => {
//   try {
//     const userRef = ref(db, `users/${userId}`);
//     const snapshot = await get(userRef);
//     if (snapshot.exists()) {
//       const userData = snapshot.val();
//       return userData.role === 'admin';
//     }
//     return false;
//   } catch (error) {
//     console.error('Error checking admin role:', error);
//     return false;
//   }
// };

// const OrdersFetch = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
  
//   useEffect(() => {
//     const checkAdmin = async () => {
//       if (auth.currentUser) {
//         const adminStatus = await checkAdminRole(auth.currentUser.uid);
//         setIsAdmin(adminStatus);
//       }
//     };
//     checkAdmin();
//   }, [auth.currentUser]);

//   useEffect(() => {
//     if (!isAdmin) return;

//     const ordersRef = ref(db, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const ordersArray = Object.entries(data).map(([key, value]) => ({
//           id: key,
//           ...value,
//         }));
//         setOrders(ordersArray);
//       }
//       setLoading(false);
//     });

//     return () => {
//       unsubscribe();
//       setOrders([]);
//     };
//   }, [isAdmin]);

//   const handleRefund = async (order) => {
//     try {
//       if (!isAdmin) {
//         throw new Error('Unauthorized: Admin privileges required');
//       }

//       const result = await Swal.fire({
//         title: 'Confirm Refund',
//         text: `Are you sure you want to refund order ${order.orderId}?`,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, refund it!',
//         cancelButtonText: 'Cancel'
//       });

//       if (result.isConfirmed) {
//         const response = await fetch(`/refund-payment`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             sessionId: order.payment.sessionId
//           })
//         });

//         if (!response.ok) {
//           throw new Error('Refund failed');
//         }

//         // Update order status in Firebase
//         const orderRef = ref(db, `orders/${order.id}`);
//         await update(orderRef, {
//           'payment.status': 'refunded',
//           'orderStatus': 'refunded',
//           'metadata.refundedAt': new Date().toISOString(),
//           'metadata.refundedBy': auth.currentUser.uid
//         });

//         Swal.fire('Refunded!', 'The order has been refunded.', 'success');
//       }
//     } catch (error) {
//       console.error('Refund error:', error);
//       Swal.fire('Error!', error.message, 'error');
//     }
//   };

//   if (!isAdmin) {
//     return <div>Unauthorized: Admin access required</div>;
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-wrapper">
//         <header>
//           <h1 className="UsrMngSoftHeader">
//             <span className="blue">Orders</span>
//             <span className="yellow"> Management</span>
//           </h1>
//         </header>
        
//         <OrdersTable 
//           orders={orders}
//           handleRefund={handleRefund}
//           isAdmin={isAdmin}
//         />
//       </div>
//     </div>
//   );
// };

// export default OrdersFetch;