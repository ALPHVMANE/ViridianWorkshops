import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { auth, db } from '../../../Config/Firebase';
import { ref, push, set } from 'firebase/database';
import './styles/AddEdit.css';

const AddOrder = ({ orders, setOrders, setIsAdding }) => {
  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Order Information
  const [products, setProducts] = useState([{
    ProdName: '',
    ProdPrice: '',
    designer: '',
    qty: 1
  }]);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Add/Remove Product Fields
  const addProductField = () => {
    setProducts([...products, {
      ProdName: '',
      ProdPrice: '',
      designer: '',
      qty: 1
    }]);
  };

  const removeProductField = (index) => {
    const updatedProducts = products.filter((_, idx) => idx !== index);
    setProducts(updatedProducts);
  };

  // Handle Product Changes
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // Calculate Total
  const calculateTotal = () => {
    return products.reduce((sum, product) => {
      return sum + (Number(product.ProdPrice) * product.qty);
    }, 0);
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // Validation
    if (!customerName || !customerEmail || !shippingAddress || products.some(p => !p.ProdName || !p.ProdPrice)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All required fields must be filled.',
        showConfirmButton: true,
      });
    }

    try {
      // Generate new Firebase key for the order
      const orderRef = ref(db, 'orders');
      const newOrderRef = push(orderRef);
      const orderId = newOrderRef.key;

      const totalAmount = calculateTotal();

      // Prepare Stripe session data
      const stripeData = {
        totalPrice: totalAmount,
        products: products.map(product => ({
          ProdName: product.ProdName,
          ProdPrice: Number(product.ProdPrice),
          designer: product.designer,
          qty: product.qty
        }))
      };

      // Create Stripe checkout session
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeData)
      });

      const session = await response.json();

      // Prepare order data
      const newOrder = {
        id: orderId,
        customerId: auth.currentUser?.uid || null,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: phoneNumber
        },
        products: products,
        totalAmount,
        status: orderStatus,
        paymentStatus,
        shippingAddress,
        orderNotes,
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase using the generated key
      await set(newOrderRef, newOrder);

      // Update local state
      setOrders([...orders, newOrder]);
      setIsAdding(false);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Order Created!',
        text: `Order #${orderId} has been created successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect to Stripe checkout if payment URL is available
      if (session.url) {
        window.location.href = session.url;
      }

    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="ae-container">
      <form onSubmit={handleAdd}>
        <h1>Create New Order</h1>
        
        {/* Customer Information Section */}
        <h2>Customer Information</h2>
        <label htmlFor="customerName">Customer Name*</label>
        <input
          id="customerName"
          type="text"
          name="customerName"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          required
        />

        <label htmlFor="customerEmail">Customer Email*</label>
        <input
          id="customerEmail"
          type="email"
          name="customerEmail"
          value={customerEmail}
          onChange={e => setCustomerEmail(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />

        {/* Products Section */}
        <h2>Products</h2>
        {products.map((product, index) => (
          <div key={index} className="product-entry">
            <label>Product {index + 1}</label>
            <input
              type="text"
              placeholder="Product Name"
              value={product.ProdName}
              onChange={e => handleProductChange(index, 'ProdName', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={product.ProdPrice}
              onChange={e => handleProductChange(index, 'ProdPrice', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Designer"
              value={product.designer}
              onChange={e => handleProductChange(index, 'designer', e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={product.qty}
              onChange={e => handleProductChange(index, 'qty', Number(e.target.value))}
            />
            {index > 0 && (
              <button type="button" onClick={() => removeProductField(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProductField}>
          Add Another Product
        </button>

        {/* Order Details */}
        <h2>Order Details</h2>
        <label htmlFor="shippingAddress">Shipping Address*</label>
        <textarea
          id="shippingAddress"
          name="shippingAddress"
          value={shippingAddress}
          onChange={e => setShippingAddress(e.target.value)}
          required
        />

        <label htmlFor="orderNotes">Order Notes</label>
        <textarea
          id="orderNotes"
          name="orderNotes"
          value={orderNotes}
          onChange={e => setOrderNotes(e.target.value)}
        />

        <label htmlFor="orderStatus">Order Status</label>
        <select
          id="orderStatus"
          name="orderStatus"
          value={orderStatus}
          onChange={e => setOrderStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <label htmlFor="paymentStatus">Payment Status</label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          value={paymentStatus}
          onChange={e => setPaymentStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <div className="total-amount">
          <h3>Total Amount: ${calculateTotal().toFixed(2)}</h3>
        </div>

        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Create Order" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default AddOrder;