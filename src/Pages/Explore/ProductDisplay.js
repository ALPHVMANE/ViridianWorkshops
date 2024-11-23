import React, { useContext } from 'react';
import { ProductList } from './ProductList';
import Swal from 'sweetalert2';
import './styles/products.css';
import { CartContext } from '../Cart/CartContext';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#262338',
    color: '#fff',
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const customSwal = Swal.mixin({
    customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        title: 'swal2-title',
        popup: 'swal2-popup',
    },
    background: '#262338',
    color: '#fff'
});

export const Products = () => {
    const { products, loading, error } = useContext(ProductList);
    const { dispatch } = useContext(CartContext);

    React.useEffect(() => {
        if (error) {
            customSwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error loading products: ${error}`,
                confirmButtonColor: '#159b8b',
                cancelButtonColor: '#1d5f62',
                footer: '<span style="color: #888;">Please login to see products</span>'
            });
        }
    }, [error]);

    const handleImageError = (e, product) => {
        e.target.src = '/api/placeholder/400/400';
        
        Toast.fire({
            icon: 'warning',
            title: `Failed to load image for ${product.ProdName}`,
            iconColor: '#159b8b',
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div>Loading products...</div>
            </div>
        );
    }

    if (error) {
        return null;
    }

    const handleAddToCart = (product) => {
        dispatch({
            type: 'ADD_TO_CART',
            product: product
        });
        
        Toast.fire({
            icon: 'success',
            position: 'top',
            title: 'Added to Cart!',
            text: product.ProdName,
            iconColor: '#159b8b',
            background: '#262338',
            color: '#fff'
        });
    };
    
    const showNoProducts = () => {
        customSwal.fire({
            icon: 'info',
            title: 'No Products Available',
            text: 'Check back soon for new products!',
            confirmButtonColor: '#159b8b',
            iconColor: '#159b8b',
            showCancelButton: false,
        });
    };

    return (
        <div className="products-page">
            {products.length === 0 ? (
                <div className="no-products">
                    {showNoProducts()}
                </div>
            ) : (
                <div className="product-container">
                    {products.map(product => (
                        <div className="product-card" key={product.ProdID}>
                            <div className="product-img">
                                {product.ProdImg && (
                                    <img 
                                        src={product.ProdImg} 
                                        alt={product.ProdName || 'Product'} 
                                        onError={(e) => handleImageError(e, product)}
                                    />
                                )}
                            </div>
                            <div className="product-name">
                                {product.ProdName}
                            </div>
                            <div className="product-designer">
                                By {product.designer}
                            </div>
                            <div className="product-price">
                                CAD$ {product.ProdPrice.toLocaleString()}
                            </div>
                            <button 
                                className="addcart-btn"
                                onClick={() => handleAddToCart(product)}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};