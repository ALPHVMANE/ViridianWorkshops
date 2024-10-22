import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import vm_logo from '../img/logo.png';
import SideMenu from '../SideMenu/SideMenu'; // Import the side menu component

const NavBar = () => {
    const [menuActive, setMenuActive] = useState(false);
    
    const toggleMenu = () => {
        setMenuActive(!menuActive);
        document.body.classList.toggle('opened', !menuActive);
    };

    return (
        <div>
            <nav className="NavBar">
                <div className="navbar-container">
                    <div className="leftside">
                        <img className="logo-nav" src={vm_logo} width="40px" alt="Viridian Workshops Logo" />
                        <h1 className="company-name">
                            Viridian <br /> Workshops
                        </h1>
                    </div>
                    <div className="rightside">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                        <svg
                            className={`ham hamRotate ham4 ${menuActive ? 'active' : ''}`}
                            viewBox="0 0 100 100"
                            width="50"
                            onClick={toggleMenu}
                        >
                            <path
                                className="line top"
                                d="m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20"
                            />
                            <path className="line middle" d="m 70,50 h -40" />
                            <path
                                className="line bottom"
                                d="m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
                            />
                        </svg>
                    </div>
                </div>
            </nav>
            <SideMenu menuActive={menuActive} />
        </div>
    );
}

export default NavBar;
