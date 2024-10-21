import React, { useEffect } from 'react';
import { auth } from '../../Config/Firebase';  // Adjust the path based on your setup
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth); // Sign out the user
      navigate('/'); // Redirect to home or login page after logout
    };

    handleLogout();
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
