import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getDatabase, ref, set } from 'firebase/database'; // Import Firebase Database
import '../../Admin/Dashboard/styles/AddEdit.css'; // Assuming you use the same styling

const EditProduct = ({ products, selectedProduct, setProducts, setIsEditing }) => {
  const [sku, setSku] = useState(selectedProduct.sku); // SKU should remain the same
  const [title, setTitle] = useState(selectedProduct.title || '');
  const [price, setPrice] = useState(selectedProduct.price || '');
  const [imageUrl, setImageUrl] = useState(selectedProduct.imageUrl || '');

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!sku || !title || !price || !imageUrl) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const updatedProduct = {
      sku,
      title,
      price,
      imageUrl,
    };

    try {
      const db = getDatabase();
      // Update the product data in the Firebase Realtime Database using SKU as the key
      const productRef = ref(db, `products/${sku}`);
      await set(productRef, updatedProduct);

      // Update the product in the products array
      const updatedProducts = products.map(product =>
        product.sku === sku ? updatedProduct : product
      );

      // Update local storage or any state management you are using
      localStorage.setItem('products_data', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setIsEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${updatedProduct.title} has been updated successfully.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="ae-container">
      <form onSubmit={handleUpdateProduct}>
        <h1>Edit Product</h1>
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          readOnly // Prevent SKU from being changed
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
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
