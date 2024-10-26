import logo from './logo.svg';
import './App.css';
import LoginForm from './Pages/Auth/LoginForm/LoginForm';
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Pages/Home/Home";
import About from "./Pages/About";
import Signup from "./Pages/Auth/Signup/Signup";
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import ProductDashboard from './Pages/Designers/Product/ProductView'
// import ProductListing from './Pages/ProductListing/ProductListing';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DynamicBg from './DynamicBg';

/* 
  npm installations:
    react-router-dom
    firebase
    firebase-admin
    react-scripts
    sweetheart2
*/

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation(); // Get the current location for dynamic CSS loading

  useEffect(() => {
    setIsAuthenticated(JSON.parse(localStorage.getItem('is_authenticated')));
  }, []);

  return (
    <div>
      <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/designer/product-view" element = {<ProductDashboard />} />
          {/* <Route path="/product-listing" element={<ProductListing />} /> */}
        </Routes>
        <DynamicBg />
    </div>

  );
}

export default App;