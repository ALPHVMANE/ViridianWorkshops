import logo from './logo.svg';
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';  
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Pages/Home";  
import About from "./Pages/About";
import Signup from "./Components/Signup/Signup";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DynamicBg from './DynamicBg';


function App() {
  return (
 
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <DynamicBg />
    </div>

  );
}

export default App;
