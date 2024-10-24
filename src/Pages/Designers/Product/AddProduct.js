import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getDatabase, ref, set } from 'firebase/database';
import '../../Admin/Dashboard/styles/AddEdit.css';

const AddProduct = ({ setIsAdding }) => {
  const [sku, setSku] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if all fields are filled
    if (!sku || !title || !price || !imageUrl) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    try {
      const db = getDatabase();
      // Create a new product reference in the database using SKU
      const newProductRef = ref(db, `products/${sku}`); // Use SKU as the unique key
      
      // Set the product data in the database
      await set(newProductRef, {
        sku,
        title,
        price,
        imageUrl,
      });

      // Optionally reset the form fields
      setSku('');
      setTitle('');
      setPrice('');
      setImageUrl('');
      
      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Product has been added successfully.',
        showConfirmButton: false,
        timer: 1500,
      });
      
      // Close the adding form
      setIsAdding(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }  
  }
  
  return (
    <div className="ae-container">
      <form onSubmit={handleAddProduct}>
        <h1>Add Product</h1>
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          required
        />
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
