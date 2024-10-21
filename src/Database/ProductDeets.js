import { getDatabase, ref, push, set } from "firebase/database";

// Initialize Firebase
const db = getDatabase();

// Function to add a new product
function addProduct(title, designer, price, imageUrl) {
  // Generate a unique key for the new product
  const newProductRef = push(ref(db, 'products'));

  // Set the product details
  set(newProductRef, {
    Title: title,
    Designer: designer,
    Price: price,
    Image: imageUrl
  });
}

// Example usage:
export { addProduct };