import React, { useContext } from 'react';
import { ProductList } from './ProductList';
import Swal from 'sweetalert2';
import './styles/products.css';

export const Products = () => {
    const { products, loading, error } = useContext(ProductList);

    // Handle general error state with SweetAlert2
    React.useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error loading products: ${error}`,
                confirmButtonColor: '#2b6cb0',
                footer: 'Please try refreshing the page'
            });
        }
    }, [error]);

    // Handle image loading error
    const handleImageError = (e, product) => {
        console.error('Image failed to load:', product.ProdImg);
        e.target.src = '/api/placeholder/400/400';  // Set placeholder image
        
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        }).fire({
            icon: 'warning',
            title: `Failed to load image for ${product.ProdName}`,
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div>Loading products...</div>
            </div>
        );
    }

    // Don't return an error div since we're handling it with SweetAlert2
    if (error) {
        return null; // SweetAlert2 will show the error
    }

    return (
        <div className="products-page">
            {products.length === 0 ? (
                <div className="no-products">
                    {/* Show a nicer message for no products */}
                    {Swal.fire({
                        icon: 'info',
                        title: 'No Products',
                        text: 'No products are currently available.',
                        confirmButtonColor: '#2b6cb0'
                    })}
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
                            <div className="product-price">
                                Rs {product.ProdPrice.toLocaleString()}.00
                            </div>
                            <button 
                                className="addcart-btn"
                                onClick={() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Added to Cart!',
                                        text: `${product.ProdName} has been added to your cart`,
                                        showConfirmButton: false,
                                        timer: 1500,
                                        position: 'top-end',
                                        toast: true
                                    });
                                    // Add your cart logic here
                                }}
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