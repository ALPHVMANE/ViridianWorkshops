import React, { useState, useEffect } from 'react';
import '../../../Styles/LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Config/Firebase';
import { getDatabase, ref, get, child } from 'firebase/database';
import useAuth from '../useAuth';

const LoginForm = () => {
    const { loggedIn, user } = useAuth();  // Use the useAuth hook to get the login status and user object
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [userRole, setUserRole] = useState(null);  // State to track user role
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (loggedIn) {
    //         checkUserRole(user.email); // Check user role
    //     }
    // }, [loggedIn, user]); // Run the effect when loggedIn or user changes

    const checkUserRole = async (email) => {
        const db = getDatabase(); // Initialize the database
        const usersRef = ref(db, 'users'); 

        try {
            const snapshot = await get(usersRef); // Fetch all user data
            if (snapshot.exists()) {
                const usersData = snapshot.val(); // Get users data
                
                // Loop through the users to find the matching email
                for (const userID in usersData) {
                    if (usersData[userID].email === email) {
                        const userRole = usersData[userID].role; // Get the user's role
                        // Navigate based on user role
                        if (userRole === 'designer') {
                            navigate("/designer-home");
                        } else if (userRole === 'technician') {
                            navigate("/technician-home");
                        } else if (userRole === 'admin') {
                            navigate("/dashboard");
                        } else if (userRole === 'driver') {
                            navigate("/driver-home");
                        } else {
                            navigate("/home"); // Default navigation if role is not recognized
                        }
                        return; // Exit the function after navigating
                    }
                }
                console.log("No role found for the user. Navigating to default home page.");
                navigate("/home"); // Default navigation if no user matches
            } else {
                console.log("No user data found.");
                navigate("/home"); // Navigate to home if no user data is present
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            navigate("/home"); // Navigate to home on error
        }
    };
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password); // Change heading color upon successful login
            setError('');
            checkUserRole(email);
        } catch (err) {
            let errorMessage = err.message; 

            // Handle common Firebase Authentication errors
            switch (err.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid Email Format';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect Password';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'User account has been disabled';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Try again later';
                    break;
                default:
                    errorMessage = 'Login failed. Please try again';
            }

            setError(errorMessage); // Display the appropriate error message
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">Not a member? <Link to="/signup">Register</Link></div>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginForm;
