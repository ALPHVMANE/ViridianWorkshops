import React, { useState } from 'react';

const OrdersTable = ({ orders, handleEdit, handleRefund }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (orderId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <table className="UsrMngTable">
      <thead>
        <tr>
          <th></th>
          <th>Order Number</th>
          <th>Order Date</th>
          <th>User Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <tr>
              <td>
                <button
                  onClick={() => toggleRow(order.id)}
                  className="expand-button"
                >
                  {expandedRows.has(order.id) ? '▼' : '▶'}
                </button>
              </td>
              <td>{order.orderNumber}</td>
              <td>
                {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
              </td>
              <td>{order.userEmail}</td>
              <td>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button 
                  onClick={() => handleEdit(order.id)} 
                  className="button muted-button"
                >
                  Edit
                </button>
                {order.payment?.status === 'paid' && (
                  <button 
                    onClick={() => handleRefund(order.id, order.payment.sessionId)}
                    className="button refund-button"
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
            {expandedRows.has(order.id) && (
              <tr className="expanded-row">
                <td colSpan="6">
                  <div className="order-details">
                    <div className="section">
                      <h4>Payment Details</h4>
                      <p>Amount: ${order.payment?.amount}</p>
                      <p>Currency: {order.payment?.currency}</p>
                      <p>Session ID: {order.payment?.sessionId}</p>
                      <p>Payment Status: {order.payment?.status}</p>
                    </div>
                    {order.products && (
                      <div className="section">
                        <h4>Products</h4>
                        <table className="products-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((product, index) => (
                              <tr key={index}>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;