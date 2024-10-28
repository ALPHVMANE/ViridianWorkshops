import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../../Admin/Dashboard/styles/AddEdit.css';

const EditProduct = ({ products, selectedProduct, setProducts, setIsEditing }) => {
  const [sku, setSku] = useState(selectedProduct.sku);
  const [title, setTitle] = useState(selectedProduct.title || '');
  const [price, setPrice] = useState(selectedProduct.price || '');
  const [imageUrl, setImageUrl] = useState(selectedProduct.imageUrl || '');
  const [designer, setDesigner] = useState({ username: selectedProduct.username || '' });
  const [role, setRole] = useState('');
  const [headingColor, setHeadingColor] = useState('white');

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}`);

        // Listen for changes in user data in real-time
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          console.log('ProductEdit Data:', data);

          if (data) {
            setRole(data.role); // Set user role
          } else {
            console.log('No data found for this user.');
            setHeadingColor('red');
          }
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleUsernameChange = (newUsername) => {
    setDesigner(prev => ({
      ...prev,
      username: newUsername
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!sku || !title || !price || !imageUrl || !designer.username) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    // Parse price to ensure it's a float with 2 decimal places
    const parsedPrice = parseFloat(parseFloat(price).toFixed(2));

    const updatedProduct = {
      sku,
      title,
      price: parsedPrice,
      imageUrl,
      username: designer.username,
    };

    try {
      const db = getDatabase();
      const productRef = ref(db, `products/${sku}`);
      await set(productRef, updatedProduct);

      const updatedProducts = products.map(product =>
        product.sku === sku ? updatedProduct : product
      );

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
        <h1 style={{ color: headingColor }}>Edit Product</h1>
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          readOnly
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
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="0.00"
        />
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
        <div>
          <label>Username</label>
          <input
            type="text"
            value={designer.username}
            onChange={(e) => role === 'admin' ? handleUsernameChange(e.target.value) : null}
            className={role === 'admin' ? 'editable-input' : 'readonly-input'}
            readOnly={role !== 'admin'}
          />
        </div>
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