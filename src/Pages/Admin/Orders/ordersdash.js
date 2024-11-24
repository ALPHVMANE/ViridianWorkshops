import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ODash = ({ setIsAuthenticated }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Listen to orders in realtime
      const ordersRef = ref(db, 'orders');
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const ordersArray = Object.entries(ordersData).map(([id, data]) => ({
            id,
            ...data
          })).sort((a, b) => b.createdAt - a.createdAt);
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
  
    const handleRefund = async (orderId, paymentIntentId) => {
      try {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Process Refund?',
          text: "This will refund the customer's payment. Continue?",
          showCancelButton: true,
          confirmButtonText: 'Yes, refund it!',
          cancelButtonText: 'No, cancel!',
        });
  
        if (result.value) {
          const response = await fetch('/api/stripe/refund', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId })
          });
  
          if (!response.ok) {
            throw new Error('Refund failed');
          }
  
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
      return <div className="orderdashboard-container"><p>Loading...</p></div>;
    }
  
    return (
      <div className="orderdashboard-container">
        <div className="orderdashboard-wrapper">
          {!isEditing && (
            <>
              <OrdersHeader />
              <OrdersTable
                orders={orders}
                handleEdit={handleEdit}
                handleRefund={handleRefund}
              />
            </>
          )}
          {isEditing && (
            <OrderEdit
              selectedOrder={selectedOrder}
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>
    );
  };

export default ODash;