import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import LoginForm from './Pages/Auth/LoginForm/LoginForm';
import Signup from './Pages/Auth/Signup/Signup';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import ProductDashboard from './Pages/Designers/Product/ProductView';
import ProductListAdmin from './Pages/Admin/AdminProduct/ProductView';
import { Products } from './Pages/Explore/ProductDisplay'; // Import Products component
import { ProductsListProvider } from './Pages/Explore/ProductList';
import DynamicBg from './DynamicBg';
import { CartContextProvider } from './Pages/Cart/CartContext';
import  {Cart}  from './Pages/Cart/Cart';
import Payment from './Pages/Payment/PaymentComponent';
import PaySuccess from './Pages/Payment/PaymentSuccess';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(JSON.parse(localStorage.getItem('is_authenticated')));
  }, []);

  return (
    <ProductsListProvider>
      <CartContextProvider>
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/explore" element={<Products />} /> {/* Add Explore route */}
            <Route path="/cart-products" element={<Cart/>}></Route>
            <Route path="/payment" element={<Payment />} />
            <Route path="/pay-success" element={<PaySuccess />} />
            <Route 
              path="/admin/dashboard" 
              element={<Dashboard />}
            />
            <Route 
              path="/admin/product-list" 
              element={<ProductListAdmin />}
            />
            <Route 
              path="/designer/product-list" 
              element={<ProductDashboard />}
            />
          </Routes>
          <DynamicBg />
        </div>
      </CartContextProvider>
    </ProductsListProvider>
  );
}

export default App;