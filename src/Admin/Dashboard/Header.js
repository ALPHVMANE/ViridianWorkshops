import React from 'react';

import LoginForm from '../../Pages/LoginForm/LoginForm';

const Header = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header>
      <h1 className="UsrMngSoftHeader">User Management Software</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button className="UsrCreateBtn" onClick={() => setIsAdding(true)}>Add User</button>
        {/* <LoginForm setIsAuthenticated={setIsAuthenticated} /> */}
      </div>
    </header>
  );
};

export default Header;