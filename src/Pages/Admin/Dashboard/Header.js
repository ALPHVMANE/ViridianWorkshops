import React from 'react';

const Header = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header>
      <h1 className="UsrMngSoftHeader">User Management Software</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button className="UsrCreateBtn" onClick={() => setIsAdding(true)}>Add User</button>
      </div>
    </header>
  );
};

export default Header;