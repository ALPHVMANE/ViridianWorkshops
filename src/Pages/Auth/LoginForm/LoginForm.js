import React, { useState } from 'react';
import '../../../Styles/LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../Config/Firebase';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [headingColor, setHeadingColor] = useState('white');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setHeadingColor('red'); // Change heading color upon successful login
            setError('');

            // Navigate based on whether the user is an admin or regular user
            if (email.includes('admin')) {
                navigate("/admin");
            } else {
                navigate("/home");
            }
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
                    <h1 style={{ color: headingColor }}>Login</h1>
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
