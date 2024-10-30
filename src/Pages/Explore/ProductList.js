import React, { createContext } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export const ProductList = createContext();

export class ProductsListProvider extends React.Component {
    state = {
        products: [],
        loading: true,  // Add loading state
        error: null    // Add error state
    }

    componentDidMount() {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        // Listen for changes in the products node
        onValue(productsRef, (snapshot) => {
            try {
                const products = [];
                if (snapshot.exists()) {  // Check if data exists
                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();
                        if (product && product.images && product.images.length > 0) { // Check if product and images exist
                            products.push({
                                ProdID: product.sku || '',
                                ProdName: product.title || '',
                                ProdPrice: product.price || 0,
                                ProdImg: product.images[0], // Using first image as main image
                                designer: product.designer || '',
                                createdAt: product.createdAt || '',
                                date: product.date || '',
                                allImages: product.images || [] // Keep all images if needed
                            });
                        }
                    });
                }

                this.setState({
                    products: products,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error("Error processing products:", error);
                this.setState({
                    loading: false,
                    error: error.message
                });
            }
        }, (error) => {
            console.error("Error fetching products:", error);
            this.setState({
                loading: false,
                error: error.message
            });
        });
    }

    render() {
        const { loading, error, products } = this.state;
        
        return (
            <ProductList.Provider 
                value={{ 
                    products: [...products],
                    loading,
                    error 
                }}
            >
                {this.props.children}
            </ProductList.Provider>
        );
    }
}