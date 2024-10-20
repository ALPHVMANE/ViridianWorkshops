import { useState, useEffect } from 'react';
import { auth } from './firebase';  // Adjust the path based on your setup
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);  // State to hold the user object
  const [loading, setLoading] = useState(true);  // State to track loading status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Set the user if logged in, or null if logged out
      setLoading(false);  // Loading is complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loggedIn: !!user, loading };
};

export default useAuth;