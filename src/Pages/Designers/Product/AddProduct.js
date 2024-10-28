import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../../Admin/Dashboard/styles/AddEdit.css';

const AddProduct = ({ setIsAdding }) => {
  const [sku, setSku] = useState(''); // SKU is auto-generated
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState(['']); // Start with one empty image input
  const [designer, setDesigner] = useState({ username: ''});
  const [role, setRole] = useState('');
  const [headingColor, setHeadingColor] = useState('white');
  const [date, setDate] = useState(''); // Date state

  const handleUsernameChange = (newUsername) => {
    // Update the username in your state/data management system
    setDesigner(prev => ({
      ...prev,
      username: newUsername
    }));
  };

  // Function to generate a random 6-digit SKU
  const generateSku = () => {
    const randomSku = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    setSku(randomSku.toString()); // Convert to string to match text input field type
  };

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
          console.log('ProductAdd Data:', data);

          if (data) {
            setDesigner({ username: data.username});
            setRole(data.role); // Assuming role is stored in the user object

          } else {
            console.log('No data found for this user.');
            setHeadingColor('red');
          }
        });
      }
    });

    // Auto-generate SKU when the form loads
    generateSku();

    // Set the current date as the default date
    const currentDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    setDate(currentDate);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle image URL changes
  const handleImageChange = (index, e) => {
    const newImages = [...images];
    newImages[index] = e.target.value;
    setImages(newImages);
  };

  // Add a new image input field
  const addImageField = () => {
    setImages([...images, '']);
  };

  const parsedPrice = parseFloat(parseFloat(price).toFixed(2));

  const handleAddProduct = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if all fields are filled
    if (!sku || !title || !price || images.some((image) => !image)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required, including all images.',
        showConfirmButton: true,
      });
    }

    try {
      const db = getDatabase();
      const newProductRef = ref(db, `products/${sku}`);

      // Set the product data in the database
      await set(newProductRef, {
        sku,
        title,
        price: parsedPrice,
        images,
        designer: `${designer.username}`,
        createdAt: new Date().toISOString(), // Date of product creation
        date, // Set the selected date
      });

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Product has been added successfully.',
        showConfirmButton: false,
        timer: 1500,
      });

      // Optionally reset the form fields
      setTitle('');
      setPrice('');
      setImages(['']);

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
  };

  return (
    <div className="ae-container">
      <form onSubmit={handleAddProduct}>
        <h1 style={{ color: headingColor }}>Add Product</h1>

        {/* SKU Field */}
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          value={sku}
          readOnly // SKU is auto-generated and not editable
        />

        {/* Title Field */}
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Price Field */}
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01" // Allow two decimal places
          min="0"     // Prevent negative prices
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="0.00"
        />

        {/* Date Field */}
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          readOnly // Make the date field read-only
        />

        {/* Image Fields */}
        <label htmlFor="imageUrls">Images</label>
        {images.map((image, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Image URL ${index + 1}`}
              value={image}
              onChange={(e) => handleImageChange(index, e)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addImageField}>
          Add Another Image
        </button>

        {/* Designer (Readonly for designers) */}
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
        {/* Action Buttons */}
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
