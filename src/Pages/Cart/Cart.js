import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import './styles/Cart.css';

export const Cart = () => {
    const { shoppingCart, totalPrice, totalQty, dispatch } = useContext(CartContext);

    const handleRemoveItem = (productId) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            productId
        });
    };

    const handleUpdateQty = (productId, newQty) => {
        if (newQty < 1) return;
        
        dispatch({
            type: 'UPDATE_QTY',
            productId,
            newQty
        });
    };

    return (
        <div className="cart-page">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart ({totalQty} items)</h2>
            
            {shoppingCart.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {shoppingCart.map(item => (
                            <div key={item.ProdID} className="cart-item flex items-center justify-between p-4 border-b">
                                <div className="item-image w-20">
                                    <img 
                                        src={item.ProdImg || '/api/placeholder/80/80'} 
                                        alt={item.ProdName}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="item-details flex-grow mx-4">
                                    <h3 className="font-semibold">{item.ProdName}</h3>
                                    <p className="text-gray-600">By {item.designer}</p>
                                    <p className="text-lg">CAD$ {item.ProdPrice.toLocaleString()}</p>
                                </div>
                                <div className="item-actions flex items-center">
                                    <button 
                                        onClick={() => handleUpdateQty(item.ProdID, item.qty - 1)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{item.qty}</span>
                                    <button 
                                        onClick={() => handleUpdateQty(item.ProdID, item.qty + 1)}
                                        className="px-2 py-1 border rounded"
                                    >
                                        +
                                    </button>
                                    <button 
                                        onClick={() => handleRemoveItem(item.ProdID)}
                                        className="ml-4 text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary mt-4 p-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">Total:</span>
                            <span className="text-xl">CAD$ {totalPrice.toLocaleString()}</span>
                        </div>
                        <button 
                            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            onClick={() => {/* Add checkout logic */}}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};