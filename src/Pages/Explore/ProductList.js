import React, { createContext } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export const ProductList = createContext();

export class ProductsListProvider extends React.Component {
    state = {
        products: [],
        loading: true,
        error: null
    }

    componentDidMount() {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        onValue(productsRef, (snapshot) => {
            try {
                const products = [];
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();

                        if (product && product.images && product.images.length > 0) {
                            const processedProduct = {
                                ProdID: product.sku || '',
                                ProdName: product.title || '',
                                ProdPrice: product.price || 0,
                                ProdImg: product.images[0],
                                designer: product.username || '',
                                createdAt: product.createdAt || '',
                                date: product.date || '',
                                allImages: product.images || []
                            };

                            products.push(processedProduct);
                        }
                    });
                }

                this.setState({
                    products: products,
                    loading: false,
                    error: null
                });

            } catch (error) {
                this.setState({
                    loading: false,
                    error: error.message
                });
            }
        }, (error) => {
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