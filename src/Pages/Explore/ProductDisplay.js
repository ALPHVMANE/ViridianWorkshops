import React, {useContext} from 'react'
import {ProductList} from './ProductList'

export const Products = () => {
    const {products} = useContext(ProductList);
    console.log(products);
    return (
        <>
        {products.length !== 0 && <h1>Products</h1>}
        {products.length === 0 && <div>slow internet... no products to display</div>}
        {products.map(product => (
            <div className='product-card' key={product.ProductID}>
                <div className='product-img'>
                    <img src={product.ProductImg} alt="not found"/>
                </div>
                <div className='product-name'>
                    {product.ProductName}
                </div>
                <div className='product-price'>
                    Rs {product.ProductPrice}.00
                </div>
                <button className='addcart-btn' >ADD TO CART</button>
            </div>
        ))}
        </>
    ) 
}