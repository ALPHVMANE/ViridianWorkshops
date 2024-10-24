import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect after logout
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { getDatabase, ref, get } from 'firebase/database';
import './SideMenu.css';

const SideMenu = ({ menuActive, toggleMenu }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [headingText, setHeadingText] = useState('Check');
    const navigate = useNavigate(); // Use navigate to redirect after logout

    useEffect(() => {
        const auth = getAuth();
        
        // Real-time authentication state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                setHeadingText(userRef);
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUserData(data);
                        // Convert user data values to a string and set it to headingText
                        const userValuesString = Object.values(data).join(', ');
                        setHeadingText(userValuesString);
                    }
                }).catch((error) => {
                    console.error("Error fetching user data:", error);
                }).finally(() => {
                    setLoading(false);
                });
            } else {
                setCurrentUser(null);
                setUserData(null);
                setLoading(false);
            }
        });

        // Cleanup on unmount i dont understand why 
        return () => unsubscribe();
    }, []);

    // Handle the logout action
    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful, redirect to login
            navigate('/login');
            toggleMenu(); // Close the menu after logout
        }).catch((error) => {
            console.error('Error during sign out:', error);
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className={`side-menu ${menuActive ? 'active' : ''}`}>
                <div className="side-menu-content">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If no user is logged in, show login prompt
    if (!currentUser) {
        return (
            <div className={`side-menu ${menuActive ? 'active' : ''}`}>
                <div className="side-menu-content">
                    <ul>
                        <li>
                            <h3>Please sign in for side menu access</h3>
                            <Link to="/login" onClick={toggleMenu}>Sign In</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    // If the user is logged in, show the side menu with user data and logout button
    return (
        <div className={`side-menu ${menuActive ? 'active' : ''}`}>
            <div className="side-menu-content-signedin">
                <ul>
                    <li>Hello, {userData ? `${userData.firstName} ${userData.lastName}` : currentUser.email}</li>
                    <li>
                        <Link to="/account" onClick={toggleMenu}>Account</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
                <p>{headingText}</p>
            </div>
        </div>
    );
};

export default SideMenu;
