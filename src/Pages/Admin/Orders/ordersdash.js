import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ref, onValue } from 'firebase/database';
import { db } from '../../../Config/Firebase';
import './styles/odashboard.css';
import OrdersHeader from './oheader';
import OrdersTable from './otable';
import CheckingOrphanedTransactions from './OrphanedOrders';
import OrderEdit from './oedit';

const OrderDash = ({ setIsAuthenticated }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to orders in realtime
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.entries(ordersData)
          .map(([id, data]) => ({
            id,
            ...data,
            // Ensure all necessary fields exist
            payment: {
              amount: 0,
              currency: 'cad',
              status: 'pending',
              ...data.payment
            },
            products: data.products || [],
            status: data.status || 'pending',
            orderDate: data.orderDate || null,
            orderNumber: data.orderNumber || 'N/A',
            userEmail: data.userEmail || 'N/A',
            userId: data.userId || 'N/A',
            metadata: data.metadata || {}
          }))
          .sort((a, b) => {
            // First sort by orderDate if it exists
            if (a.orderDate && b.orderDate) {
              return b.orderDate - a.orderDate;
            }
            // Fallback to createdAt
            return b.createdAt - a.createdAt;
          });
        
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = id => {
    const order = orders.find(order => order.id === id);
    setSelectedOrder(order);
    setIsEditing(true);
  };

  const handleRefund = async (orderId, sessionId) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Process Refund?',
        text: "This will refund the customer's payment. Continue?",
        showCancelButton: true,
        confirmButtonText: 'Yes, refund it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#19837a',
        cancelButtonColor: '#464A52',
      });

      if (result.value) {
        const response = await fetch('/api/stripe/refund', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId })
        });

        if (!response.ok) {
          throw new Error('Refund failed');
        }

        // Update local order status
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status: 'refunded',
              payment: {
                ...order.payment,
                status: 'refunded'
              }
            };
          }
          return order;
        });
        setOrders(updatedOrders);

        Swal.fire({
          icon: 'success',
          title: 'Refunded!',
          text: 'The order has been refunded successfully.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Refund error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="orderdashboard-container">
        <div className="dashboard-wrapper">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orderdashboard-container">
      <div className="orderdashboard-wrapper">
        {!isChecking && !isEditing && (
          <>
            <OrdersHeader
              setIsChecking={setIsChecking}
              setIsAuthenticated={setIsAuthenticated}
            />
            <OrdersTable
              orders={orders || []}
              handleEdit={handleEdit}
              handleRefund={handleRefund}
            />
          </>
        )}
        {isChecking && (
          <CheckingOrphanedTransactions
            orders={orders || []}
            setOrders={setOrders}
            setIsChecking={setIsChecking}
          />
        )}
        {isEditing && (
          <OrderEdit
            orders={orders || []}
            selectedOrder={selectedOrder}
            setOrders={setOrders}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDash;