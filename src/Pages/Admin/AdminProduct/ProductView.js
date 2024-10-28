import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../Designers/Product/styles/table.css';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../../../Config/Firebase'; // Ensure to import db

import ProductHeader from './HeaderProduct';
import ProductTable from './ProductTable';
import AddProduct from '../../Designers/Product/AddProduct'; // Ensure you create this component
import EditProduct from '../../Designers/Product/EditProduct'; // Ensure you create this component

const styles = {
  productImage: {
    maxHeight: '60px',
    width: 'auto',
    objectFit: 'contain'
  }
};

const ProductViewAdmin = ({ setIsAuthenticated, designerId }) => { // Add designerId prop
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, 'products');

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Filter products to only include those for the logged-in designer
        const filteredProducts = productsArray.filter(product => product.designerId === designerId);
        setProducts(filteredProducts);
      }
      setLoading(false);
    });

    return () => {
      setProducts([]);
    };
  }, [designerId]); // Add designerId to the dependency array

  const handleEdit = id => {
    const [product] = products.filter(product => product.id === id);
    setSelectedProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.value) {
        const [product] = products.filter(product => product.id === id);

        // Remove product from Firebase Realtime Database
        await remove(ref(db, 'products/' + id));

        // Update local state
        const productsCopy = products.filter(product => product.id !== id);
        setProducts(productsCopy);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${product.title} has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {!isAdding && !isEditing && (
          <>
            <ProductHeader
              setIsAdding={setIsAdding}
              setIsAuthenticated={setIsAuthenticated}
            />
            <ProductTable
              products={products || []}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              imageStyle={styles.productImage} 
            />
          </>
        )}
        {isAdding && (
          <AddProduct
            products={products || []}
            setProducts={setProducts}
            setIsAdding={setIsAdding}
          />
        )}
        {isEditing && (
          <EditProduct
            products={products || []}
            selectedProduct={selectedProduct}
            setProducts={setProducts}
            setIsEditing={setIsEditing}
          />
        )}
      </div>
    </div>
  );
};

export default ProductViewAdmin;
