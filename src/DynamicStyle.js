import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Admin from './Pages/Admin';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Determine the current path and set the appropriate CSS file
    let cssFileName = '';

    switch (location.pathname) {
      case '/signup':
        cssFileName = 'Signup.css';
        break;
      case '/dashboard':
        cssFileName = 'Dashboard.css';
        break;
      case '/admin':
        cssFileName = 'Admin.css';
        break;
      default:
        cssFileName = 'Home.css'; // Default CSS for home
        break;
    }

    // Dynamically import the CSS file
    import(`./styles/${cssFileName}`)
      .then(() => console.log(`${cssFileName} loaded`))
      .catch(err => console.error(`Error loading ${cssFileName}:`, err));

  }, [location]);

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
    </Switch>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
