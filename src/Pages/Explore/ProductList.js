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
        console.log('🚀 ProductsListProvider: Initializing...');
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        console.log('📡 Setting up Firebase listener...');

        // Listen for changes in the products node
        onValue(productsRef, (snapshot) => {
            try {
                console.log('📥 Raw Firebase data received:', snapshot.val());
                
                const products = [];
                if (snapshot.exists()) {
                    console.log('✅ Data exists in Firebase');
                    
                    snapshot.forEach((childSnapshot) => {
                        const product = childSnapshot.val();
                        console.log('🔍 Processing product:', product);

                        if (product && product.images && product.images.length > 0) {
                            const processedProduct = {
                                ProdID: product.sku || '',
                                ProdName: product.title || '',
                                ProdPrice: product.price || 0,
                                ProdImg: product.images[0],
                                designer: product.designer || '',
                                createdAt: product.createdAt || '',
                                date: product.date || '',
                                allImages: product.images || []
                            };

                            products.push(processedProduct);
                            console.log('✨ Processed product:', processedProduct);
                        } else {
                            console.warn('⚠️ Skipped product due to missing data:', {
                                hasProduct: !!product,
                                hasImages: product?.images,
                                imageCount: product?.images?.length
                            });
                        }
                    });

                    console.log('📊 Final processed products array:', products);
                } else {
                    console.warn('⚠️ No data exists in Firebase snapshot');
                }

                this.setState({
                    products: products,
                    loading: false,
                    error: null
                }, () => {
                    console.log('💾 State updated successfully:', {
                        productCount: products.length,
                        loading: false,
                        error: null
                    });
                });

            } catch (error) {
                console.error('❌ Error processing products:', {
                    error: error,
                    message: error.message,
                    stack: error.stack
                });
                
                this.setState({
                    loading: false,
                    error: error.message
                }, () => {
                    console.log('💾 State updated with error:', {
                        loading: false,
                        error: error.message
                    });
                });
            }
        }, (error) => {
            console.error('❌ Firebase fetch error:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            
            this.setState({
                loading: false,
                error: error.message
            }, () => {
                console.log('💾 State updated with Firebase error:', {
                    loading: false,
                    error: error.message
                });
            });
        });
    }

    render() {
        const { loading, error, products } = this.state;
        
        console.log('🎨 Rendering ProductList.Provider:', {
            productsCount: products.length,
            loading,
            error,
            firstProduct: products[0] // Show first product as example
        });
        
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