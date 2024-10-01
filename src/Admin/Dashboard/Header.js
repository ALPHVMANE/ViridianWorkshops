import React from 'react';

import Login from '../../Pages/LoginForm/LoginForm';

const Header = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header>
      <h1>User Management Software</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button onClick={() => setIsAdding(true)}>Add Employee</button>
        <LoginForm setIsAuthenticated={setIsAuthenticated} />
      </div>
    </header>
  );
};

export default Header;