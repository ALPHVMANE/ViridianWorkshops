import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import your styles
import Logout from '../Pages/Auth/Logout/Logout';

const Sidebar = () => {
  return (
    <div className="designer-sidebar">
      <h2 className="designer-sidebar-title">Menu</h2>
      <nav>
        <ul className="sidebar-menu">
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;