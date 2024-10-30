import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import vm_logo from '../img/logo.png';
import SideMenu from '../SideMenu/SideMenu'; // Import the side menu
import { ReactComponent as CartIcon } from '../svg/cart_icon.svg';

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
                            <li><Link to="/explore">Explore</Link></li>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li className="cart-position">
                                <Link to="/cart-products">
                                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="icon glyph">
                                        <path 
                                            d="M10.62,14l-1,2H19a1,1,0,0,1,0,2H9.62a2,2,0,0,1-1.79-2.89L8.9,13,5.32,4H3A1,1,0,0,1,3,2H5.32A2,2,0,0,1,7.18,3.26L7.88,5H20.8l.09,0a1,1,0,0,1,.48.05,1,1,0,0,1,.56,1.3l-2.8,7a1,1,0,0,1-.93.63Zm-.12,5A1.5,1.5,0,1,0,12,20.5,1.5,1.5,0,0,0,10.5,19Zm6,0A1.5,1.5,0,1,0,18,20.5,1.5,1.5,0,0,0,16.5,19Z" 
                                            style={{ fill: 'white' }}
                                        />
                                    </svg>
                                </Link>
                            </li>
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
