import React from 'react';

const ProductHeader = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header>
      <h1 className="ProdMngSoftHeader">Product Management Software</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button className="ProdCreateBtn" onClick={() => setIsAdding(true)}>Add Product</button>
      </div>
    </header>
  );
};

export default ProductHeader;
