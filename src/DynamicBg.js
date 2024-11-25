import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AbstractBg from './Components/img/AbstractBg.jpg';
import AdminBg from './Components/img/AdminBg.jpg';
import DesignerBg from './Components/img/desginer_prodCRUD.jpg';
import AbtBg from './Components/img/ocean.jpg';

const DynamicBg = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const setBodyBackground = () => {
      switch (location.pathname) {
        case '/home':
          document.body.style.backgroundColor = 'lightblue';
          break;
        case '/about':
          document.body.style.backgroundImage = `url(${AbtBg})`;
          document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
          document.body.style.backgroundPosition = 'center';
          break;
        case '/login':
          document.body.style.backgroundImage = `url(${AbstractBg})`;
          document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
          document.body.style.backgroundPosition = 'center';
          break;
        case '/admin/dashboard':
        document.body.style.backgroundImage = `url(${AdminBg})`;
        document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
        document.body.style.backgroundPosition = 'center';
        case '/admin/product-list':
        document.body.style.backgroundImage = `url(${AdminBg})`;
        document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
        document.body.style.backgroundPosition = 'center';
        break;
        case '/admin/order-list':
        document.body.style.backgroundImage = `url(${AdminBg})`;
        document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
        document.body.style.backgroundPosition = 'center';
        break;
        case '/signup':
        document.body.style.backgroundImage = `url(${AbstractBg})`;
        document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
        document.body.style.backgroundPosition = 'center';
        break;
        case '/designer/product-view':
          document.body.style.backgroundImage = `url(${DesignerBg})`;
          document.body.style.backgroundSize = 'cover'; // Ensure the image covers the body
          document.body.style.backgroundPosition = 'center';
          break;
        
        default:
          document.body.style.backgroundColor = 'white'; // Default background
      }
    };

    setBodyBackground();

    // Cleanup function to reset the background when unmounting
    return () => {
      document.body.style.backgroundColor = ''; // Reset background
      document.body.style.background = '';
    };
  }, [location.pathname]);

  return <>{children}</>;
};

export default DynamicBg;