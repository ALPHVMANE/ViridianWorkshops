// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import { auth, db } from '../../../Config/Firebase'; // Import your firebase config
// import { updateEmail } from 'firebase/auth';
// import { ref, set } from 'firebase/database';

// const Edit = ({ products, selectedProduct, setProducts, setIsEditing }) => {
//   const id = selectedProduct.sku; // Assuming SKU is the unique identifier

//   const [title, setTitle] = useState(selectedProduct.title || '');
//   const [price, setPrice] = useState(selectedProduct.price || '');
//   const [images, setImages] = useState(selectedProduct.images || []); // New state for images
//   const [firstName, setFirstName] = useState(selectedProduct.first_name || ''); // Designer's first name
//   const [lastName, setLastName] = useState(selectedProduct.last_name || ''); // Designer's last name

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!title || !price || images.length === 0 || !firstName || !lastName) {
//       return Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'All fields are required.',
//         showConfirmButton: true,
//       });
//     }

//     const updatedProduct = {
//       sku: id,
//       title,
//       price: parseFloat(price), // Ensure price is a number
//       images,
//       first_name: firstName,
//       last_name: lastName,
//     };

//     try {
//       // Update the product in the Firebase Realtime Database
//       await set(ref(db, 'products/' + id), updatedProduct);

//       // Update the product in the products array
//       const updatedProducts = products.map(product => (product.sku === id ? updatedProduct : product));

//       localStorage.setItem('products_data', JSON.stringify(updatedProducts));
//       setProducts(updatedProducts);
//       setIsEditing(false);

//       Swal.fire({
//         icon: 'success',
//         title: 'Updated!',
//         text: `Product ${updatedProduct.title} has been updated.`,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: error.message,
//         showConfirmButton: true,
//       });
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const imageUrls = files.map(file => URL.createObjectURL(file)); // Generate image URLs from selected files
//     setImages(imageUrls);
//   };

//   return (
//     <div className="ae-container">
//       <form onSubmit={handleUpdate}>
//         <h1>Edit Product</h1>
//         <label htmlFor="title">Title</label>
//         <input
//           id="title"
//           type="text"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//           required
//         />
//         <label htmlFor="price">Price</label>
//         <input
//           id="price"
//           type="number"
//           value={price}
//           onChange={e => setPrice(e.target.value)}
//           required
//         />
//         <label htmlFor="images">Images</label>
//         <input
//           id="images"
//           type="file"
//           multiple
//           onChange={handleImageChange}
//           accept="image/*"
//         />
//         {/* Display selected images */}
//         <div className="image-preview-container">
//           {images.map((imageUrl, index) => (
//             <img key={index} src={imageUrl} alt={`Product Image ${index + 1}`} className="product-image" />
//           ))}
//         </div>
//         <label htmlFor="firstName">Designer First Name</label>
//         <input
//           id="firstName"
//           type="text"
//           value={firstName}
//           onChange={e => setFirstName(e.target.value)}
//           required
//         />
//         <label htmlFor="lastName">Designer Last Name</label>
//         <input
//           id="lastName"
//           type="text"
//           value={lastName}
//           onChange={e => setLastName(e.target.value)}
//           required
//         />
//         <div style={{ marginTop: '30px' }}>
//           <input type="submit" value="Update" />
//           <input
//             style={{ marginLeft: '12px' }}
//             className="muted-button"
//             type="button"
//             value="Cancel"
//             onClick={() => setIsEditing(false)}
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Edit;
