import React from 'react';

const OrdersTable = ({ orders, handleEdit, handleRefund }) => {
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
      }).format(amount);
    };
  
    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
  
    return (
      <table className="OrderMngTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.orderId}</td>
              <td>
                {order.paymentDetails?.customerName || 'N/A'}
                <br />
                <small>{order.paymentDetails?.customerEmail || 'N/A'}</small>
              </td>
              <td>
                {order.products?.map(product => (
                  <div key={product.ProdName} className="product-item-small">
                    {product.ProdName} (x{product.qty})
                  </div>
                ))}
              </td>
              <td>{formatCurrency(order.totalAmount)}</td>
              <td>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <span className={`status-badge ${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <button
                  onClick={() => handleEdit(order.id)}
                  className="button muted-button"
                >
                  View
                </button>
                {order.paymentStatus === 'paid' && order.status !== 'refunded' && (
                  <button
                    onClick={() => handleRefund(order.id, order.paymentDetails?.paymentIntentId)}
                    className="button refund-button"
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

export default OrdersTable;