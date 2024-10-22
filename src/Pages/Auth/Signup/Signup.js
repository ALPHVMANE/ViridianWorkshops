import React, { useState } from 'react';
import '../../../Styles/Signup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../Config/Firebase';
import { ref, set } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();  
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, 'users/' + user.uid), {
                username: username,
                first_name: firstName,
                last_name: lastName,   
                email: email,    
                createdAt: new Date().toISOString(),
                role: role // Store the role, defaulting to "user"
            });

            alert("Account created successfully");
            setFirstName('');
            setLastName('');
            setError('');
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err) {
            let errorMessage = err.message; 
            switch (err.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already in use';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid Email Format';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Weak Password: Must be at least 6 characters';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Account creation is disabled';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Try again later';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection';
                    break;
                default:
                    errorMessage = 'An unexpected error occurred. Please try again';
                    break;
            }
            setError(errorMessage); 
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
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
                    <div className="register-link">Already have an account? <Link to="/login">Signin</Link></div>
                    <button type="submit">Create Account</button>
                </form>
                <br />
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Signup;
