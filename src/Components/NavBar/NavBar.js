import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 
import LoginForm from "../LoginForm/LoginForm";
import vm_logo from '../img/logo.png';


const NavBar = () => {
  return (
    <nav className="NavBar">
        <div className = "container">
            <div className = "rightside">
                <img src= {vm_logo} width="50px"/>

            </div>

            <div className = "leftside">
            <ul> 
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link> 
                </li>
            </ul>
            </div>
        </div>   
    </nav>
  );
}
export default NavBar;
