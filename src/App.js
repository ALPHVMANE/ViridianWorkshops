import logo from './logo.svg';
import './App.css';
import LoginForm from './Pages/LoginForm/LoginForm';  
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Pages/Home";  
import About from "./Pages/About";
import Signup from "./Pages/Signup/Signup";
import Admin from "./Pages/Admin";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DynamicBg from './DynamicBg';
import Dashboard from './Admin/Dashboard/Dashboard';
/* 
  npm installations:
    react-router-dom
    firebase
    firebase-admin
    react-scripts
*/

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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
      </Routes>
      <DynamicBg />
      {isAuthenticated ? (
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Home setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default App;

