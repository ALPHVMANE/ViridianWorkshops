import logo from './logo.svg';
import './App.css';
import LoginForm from './Pages/LoginForm/LoginForm';
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Signup from "./Pages/Signup/Signup";
import Admin from "./Pages/Admin";
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DynamicBg from './DynamicBg';
import Dashboard from './Admin/Dashboard/Dashboard';

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
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <DynamicBg />
    </div>
  );
}

export default App;