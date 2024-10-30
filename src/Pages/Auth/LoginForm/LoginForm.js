import '../../../Styles/LoginForm.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../Config/Firebase';
import { getDatabase, ref, get } from 'firebase/database';
import useAuth from '../useAuth';

const LoginForm = () => {
    const { loggedIn, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');
    const navigate = useNavigate();

    const checkUserRole = async (email) => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');

        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                
                for (const userID in usersData) {
                    if (usersData[userID].email === email) {
                        const userRole = usersData[userID].role;
                        if (userRole === 'designer') {
                            navigate("/designer/product-view");
                        } else if (userRole === 'technician') {
                            navigate("/technician-home");
                        } else if (userRole === 'admin') {
                            navigate("/admin/dashboard");
                        } else if (userRole === 'driver') {
                            navigate("/driver-home");
                        } else {
                            navigate("/home");
                        }
                        return;
                    }
                }
                navigate("/home");
            } else {
                navigate("/home");
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            navigate("/home");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError('');
            checkUserRole(email);
        } catch (err) {
            let errorMessage = err.message;

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
                    errorMessage = err.code;
            }

            setError(errorMessage);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('Password reset email sent! Please check your inbox.');
            setResetError('');
            setTimeout(() => {
                setIsResetModalOpen(false);
                setResetMessage('');
                setResetEmail('');
            }, 3000);
        } catch (err) {
            let errorMessage = 'Failed to send reset email';
            
            switch (err.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many requests. Please try again later';
                    break;
                default:
                    errorMessage = err.message;
            }
            
            setResetError(errorMessage);
            setResetMessage('');
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
                    <div className="register-link">
                        Not a member? <Link to="/signup">Register</Link>
                    </div>
                    <div className="forgot-password-link">
                        <button
                            type="button"
                            onClick={() => setIsResetModalOpen(true)}
                            className="text-button"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Password Reset Modal */}
            {isResetModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reset Password</h2>
                        <form onSubmit={handleResetPassword}>
                            <div className="input-box">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">Send Reset Link</button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsResetModalOpen(false);
                                        setResetMessage('');
                                        setResetError('');
                                        setResetEmail('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {resetMessage && <p className="success-message">{resetMessage}</p>}
                        {resetError && <p className="error-message">{resetError}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;