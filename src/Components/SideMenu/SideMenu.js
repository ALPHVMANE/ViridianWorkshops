import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import './SideMenu.css';

const SideMenu = ({ menuActive, toggleMenu }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [headingColor, setHeadingColor] = useState('white')

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        setHeadingColor('red');
        if (user) {
            // If a user is logged in, set  user and fetch data
            setCurrentUser(user);

            // Fetch user data from the Realtime Database
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                }
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
        } else {
            // Clear user data if no one is logged in
            setCurrentUser(null);
            setUserData(null);
        }
    }, []);

    // If no user is logged in, show login prompt and hide the rest of the menu
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

    // Show the side menu with user data if logged in
    return (
        <div className={`side-menu ${menuActive ? 'active' : ''}`}>
            <div className="side-menu-content-signedin">
                <ul>
                    <li>Hello, {userData ? `${userData.firstName} ${userData.lastName}` : currentUser.email}</li>
                    <li>
                        <Link to="/account" onClick={toggleMenu}>Account</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
