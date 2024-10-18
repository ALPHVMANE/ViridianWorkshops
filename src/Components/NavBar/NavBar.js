import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; 
import vm_logo from '../img/logo.png';

const NavBar = () => {
    // const [role, setRole] = useState('');
  
    // useEffect(() => {
    //   // Fetch the user role (this could be from Firebase, API, etc.)
    //   const userRole = getUserRole();
    //   setRole(userRole);
    // }, []);
    return (
        // <nav>
        //   {role === 'admin' ? AdminNavBar() : UserNavBar()}
        // </nav>
        <nav className="NavBar">
            <div className = "navbar-container">
                <div className = "leftside">
                    <img className="logo-nav" src= {vm_logo} width="50px"/>
                    <h1 className= "company-name">
                        Viridian <br></br>
                        Workshops
                    </h1>
                </div>
                <div className = "rightside">
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

    function AdminNavBar(){
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
                    <Link to="/account-list">All Accounts</Link>
                    </li>
                    <li>
                    <Link to="/admin-signup">Create Account</Link> 
                    </li>
                </ul>
                </div>
            </div>   
        </nav>
      );
    }

function UserNavBar(){
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
