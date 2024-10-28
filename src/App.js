// App.js
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Remove BrowserRouter from here

import NavBar from './Components/NavBar/NavBar';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import LoginForm from './Pages/Auth/LoginForm/LoginForm';
import Signup from './Pages/Auth/Signup/Signup';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import ProductDashboard from './Pages/Designers/Product/ProductView';
import ProductListAdmin from './Pages/Admin/AdminProduct/ProductView';
import DynamicBg from './DynamicBg';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

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
        <Route path="/admin/product-list" element={<ProductListAdmin />} />
        <Route path="/designer/product-view" element={<ProductDashboard />} />
        {/* <Route path="/product-listing" element={<ProductListing />} /> */}
      </Routes>
      <DynamicBg />
    </div>
  );
}

export default App;