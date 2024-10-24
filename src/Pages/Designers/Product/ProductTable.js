import React from 'react';

const ProductTable = ({ products, handleEdit, handleDelete }) => {
  return (
    <table className="ProductMngTable">
      <thead>
        <tr>
          <th>#</th>
          <th>SKU</th> 
          <th>Title</th>
          <th>Price</th>
          <th>Image URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.sku}>
            <td>{index + 1}</td>
            <td>{product.sku || 'N/A'}</td> {/* Display SKU, default to 'N/A' if missing */}
            <td>{product.title || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>
              {/* Check if price is a valid number before formatting */}
              {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : 'N/A'}
            </td>
            <td>{product.imageUrl || 'N/A'}</td> {/* Default to 'N/A' if missing */}
            <td>
              <button onClick={() => handleEdit(product.sku)} className="button muted-button">Edit</button>
              <button onClick={() => handleDelete(product.sku)} className="button muted-button">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
