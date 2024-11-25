import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
const OrderEdit = ({ selectedOrder, setIsEditing }) => {
    const [status, setStatus] = useState(selectedOrder.status);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(selectedOrder.paymentStatus);
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
  
      try {
        // First update order status in Firebase
        const updateResponse = await fetch(`/api/orders/${selectedOrder.id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status,
            paymentStatus
          })
        });
  
        if (!updateResponse.ok) {
          throw new Error('Failed to update order status');
        }
  
        // If payment status is being changed to refunded, process the refund in Stripe
        if (paymentStatus === 'refunded' && selectedOrder.paymentStatus !== 'refunded') {
          const paymentIntentId = selectedOrder.paymentDetails?.paymentIntentId;
          
          if (!paymentIntentId) {
            throw new Error('Payment intent ID not found');
          }
  
          // Process refund through Stripe
          const refundResponse = await fetch('/api/stripe/refund', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId,
              amount: selectedOrder.totalAmount * 100 // Convert to cents for Stripe
            })
          });
  
          if (!refundResponse.ok) {
            throw new Error('Failed to process refund');
          }
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Order has been updated successfully.`,
          showConfirmButton: false,
          timer: 1500,
        });
  
        setIsEditing(false);
      } catch (error) {
        console.error('Update error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.message,
          showConfirmButton: true,
        });
      } finally {
        setIsProcessing(false);
      }
    };
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount);
    };
  
    return (
      <div className="ae-container">
        <form onSubmit={handleUpdate}>
          <h1>Order Details</h1>
          
          <div className="order-details-grid">
            <div className="detail-group">
              <label>Order ID</label>
              <div>{selectedOrder.orderId}</div>
            </div>
  
            <div className="detail-group">
              <label>Customer Email</label>
              <div>{selectedOrder.paymentDetails?.customerEmail || 'N/A'}</div>
            </div>
  
            <div className="detail-group">
              <label>Total Amount</label>
              <div>{formatCurrency(selectedOrder.totalAmount)}</div>
            </div>
  
            <div className="detail-group">
              <label>Payment Method</label>
              <div>{selectedOrder.paymentDetails?.paymentMethod || 'N/A'}</div>
            </div>
  
            <div className="detail-group">
              <label htmlFor="status">Order Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isProcessing}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
  
            <div className="detail-group">
              <label htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus === 'refunded') {
                    Swal.fire({
                      title: 'Confirm Refund',
                      text: 'This will process a refund through Stripe. Continue?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, process refund',
                      cancelButtonText: 'No, cancel'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setPaymentStatus(newStatus);
                      }
                    });
                  } else {
                    setPaymentStatus(newStatus);
                  }
                }}
                disabled={isProcessing || selectedOrder.paymentStatus === 'refunded'}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
  
            {selectedOrder.refundDetails && (
              <div className="detail-group">
                <label>Refund Information</label>
                <div>
                  Amount: {formatCurrency(selectedOrder.refundDetails.refundAmount)}
                  <br />
                  Date: {new Date(selectedOrder.refundDetails.refundDate).toLocaleString()}
                  <br />
                  Status: {selectedOrder.refundDetails.refundStatus}
                </div>
              </div>
            )}
          </div>
  
          <div className="products-section">
            <h2>Products</h2>
            <div className="products-grid">
              {selectedOrder.products?.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-name">{product.ProdName}</div>
                  <div className="product-details">
                    <span>Quantity: {product.qty}</span>
                    <span>Price: {formatCurrency(product.ProdPrice)}</span>
                    <span>Designer: {product.designer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div style={{ marginTop: '30px' }}>
            <input 
              type="submit" 
              value="Update Order" 
              disabled={isProcessing}
            />
            <input
              style={{ marginLeft: '12px' }}
              className="muted-button"
              type="button"
              value="Close"
              onClick={() => setIsEditing(false)}
              disabled={isProcessing}
            />
          </div>
        </form>
      </div>
    );
  };

  export default OrderEdit;