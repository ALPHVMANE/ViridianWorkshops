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
          <th>Designer</th>
          <th>Images</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.sku}>
            <td>{index + 1}</td>
            <td>{product.sku || 'N/A'}</td>
            <td>{product.title || 'N/A'}</td>
            <td>$ {product.price !== undefined && typeof product.price === 'number' 
              ? product.price.toFixed(2) 
              : 'N/A'}</td>
            <td>{product.username || 'N/A'}</td>
            <td>
              {product.images && product.images.length > 0 ? (
                <div className="image-container">
                  {product.images.map((imageUrl, i) => (
                    <img
                      key={i}
                      src={imageUrl}
                      alt={`Product Image ${i + 1}`}
                      className="product-image"
                      style={{
                        maxHeight: '100px',
                        width: 'auto',
                        objectFit: 'contain',
                        margin: '2px'
                      }}
                    />
                  ))}
                </div>
              ) : (
                'N/A'
              )}
            </td>
            <td>
              <button 
                onClick={() => handleEdit(product.sku)} 
                className="button muted-button"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(product.sku)} 
                className="button muted-button"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;