import React, { createContext } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export const ProductList = createContext();

export class ProductsListProvider extends React.Component {
    state = {
        products: []
    }

    componentDidMount() {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        // Listen for changes in the products node
        onValue(productsRef, (snapshot) => {
            const products = [];
            snapshot.forEach((childSnapshot) => {
                const product = childSnapshot.val();
                products.push({
                    ProdID: product.sku,
                    ProdName: product.title,
                    ProdPrice: product.price,
                    ProdImg: product.images[0], // Using first image as main image
                    designer: product.designer,
                    createdAt: product.createdAt,
                    date: product.date,
                    allImages: product.images // Keep all images if needed
                });
            });

            this.setState({
                products: products
            });
        }, (error) => {
            console.error("Error fetching products:", error);
        });
    }

    render() {
        return (
            <ProductList.Provider value={{ products: [...this.state.products] }}>
                {this.props.children}
            </ProductList.Provider>
        );
    }
}