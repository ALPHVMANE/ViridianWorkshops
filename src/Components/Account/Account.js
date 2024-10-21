import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../useAuth';  // Adjust the path based on your setup

const AccountPage = () => {
  const { user, loggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-container">
      {loggedIn ? (
        <div>
          <h1>Welcome, {user.displayName || user.email}!</h1>
          <p>You are currently logged in.</p>
          <Link to="/logout">Logout</Link>
          {/* Add links to other parts of your website */}
          <nav>
            <Link to="/products">Products</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        </div>
      ) : (
        <p>Please log in to access your account.</p>
      )}
    </div>
  );
};

export default AccountPage;
