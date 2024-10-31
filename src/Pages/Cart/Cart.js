import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './styles/Cart.css';

export const Cart = () => {
    const { shoppingCart, totalPrice, totalQty, dispatch } = useContext(CartContext);
    const navigate = useNavigate();

    const handleRemoveItem = (productId) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            productId
        });
    };

    const handleUpdateQty = (productId, newQty, currentStock) => {
        // Prevent negative quantities
        if (newQty < 1) return;
        
        // Optional: Check against available stock
        if (currentStock && newQty > currentStock) {
            alert(`Sorry, only ${currentStock} items available in stock`);
            return;
        }
        
        dispatch({
            type: 'UPDATE_QTY',
            productId,
            newQty
        });
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('http://localhost:5252/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalPrice: totalPrice,
                    products: shoppingCart
                })
            });

            const data = await response.json();
            
            if (data.error) {
                console.error('Payment Intent Error:', data.error);
                return;
            }

            console.log('Payment Intent Created:', data.clientSecret);
            navigate('/payment', { 
                state: { 
                    clientSecret: data.clientSecret,
                    totalAmount: totalPrice 
                }
            });
        } catch (error) {
            console.error('Checkout Error:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart ({totalQty} items)</h2>
            
            {shoppingCart.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Your cart is empty</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="divide-y">
                        {shoppingCart.map(item => (
                            <div key={item.ProdID} className="flex items-center gap-4 py-4">
                                <div className="w-20 h-20 flex-shrink-0">
                                    <img 
                                        src={item.ProdImg || '/api/placeholder/80/80'} 
                                        alt={item.ProdName}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.ProdName}</h3>
                                    <p className="text-gray-600 text-sm">By {item.designer}</p>
                                    <p className="text-lg font-medium mt-1">
                                        CAD ${(item.ProdPrice * item.qty).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleUpdateQty(item.ProdID, item.qty - 1, item.stock)}
                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Decrease quantity"
                                        disabled={item.qty <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.qty}</span>
                                    <button 
                                        onClick={() => handleUpdateQty(item.ProdID, item.qty + 1, item.stock)}
                                        className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Increase quantity"
                                        disabled={item.stock && item.qty >= item.stock}
                                    >
                                        +
                                    </button>
                                    <button 
                                        onClick={() => handleRemoveItem(item.ProdID)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                        aria-label="Remove item"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mt-6">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Total:</span>
                            <span className="text-xl">CAD ${totalPrice.toLocaleString()}</span>
                        </div>
                        <button 
                            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCheckout}
                            disabled={shoppingCart.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};