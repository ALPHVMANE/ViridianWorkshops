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
                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        console.log("User data:", data);
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

        // Cleanup on unmount
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
                            <h3 className="side-menu-login-prompt">Please sign in for side menu access</h3>
                            <Link to="/login" onClick={toggleMenu} children className="side-menu-login-button">Sign In</Link>
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
                <h2 className="side-menu-welcome">Welcome, {userData ? `${userData.first_name} ${userData.last_name}` : currentUser.email}</h2>
                <ul> 
                    {/* Conditional Links Based on Role */}
                    {userData?.role === 'admin' ? (
                        <>
                            <li>
                                <Link to="/admin/dashboard" onClick={toggleMenu}>User Management</Link>
                            </li>
                            <li>
                                <Link to="/admin/settings" onClick={toggleMenu}>Settings</Link>
                            </li>
                            {/* <li>
                                <Link to="/sales" onClick={toggleMenu}>Admin Sales</Link>
                            </li> */}
                        </>
                    ) : userData?.role === 'user' ? (
                        <>
                            <li>
                                <Link to="/account" onClick={toggleMenu}>Account</Link>
                            </li>
                            <li>
                                <Link to="/settings" onClick={toggleMenu}>User Settings</Link>
                            </li>
                        </>
                    ) : userData?.role === 'designer' ? (
                        <>
                            <li>
                                <Link to="/designer/product-view" onClick={toggleMenu}>Product Designs</Link>
                            </li>
                            <li>
                                <Link to="/settings" onClick={toggleMenu}>Settings</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/account" onClick={toggleMenu}>Account</Link>
                        </li>
                    )}

                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
