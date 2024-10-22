import React from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ menuActive, toggleMenu }) => {
    return (
        <div className={`side-menu ${menuActive ? 'active' : ''}`}>
            <div className="side-menu-content">
                <ul>
                    <li>
                        <Link to="/login" onClick={toggleMenu}>Login</Link>
                    </li>
                    <li>
                        <Link to="/account" onClick={toggleMenu}>Account</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;