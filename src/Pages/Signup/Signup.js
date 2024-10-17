import React, { useState } from 'react';
import './Signup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Config/Firebase';
import { ref, set } from 'firebase/database';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();  
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(db, 'users/' + user.uid), {
                username: username,   
                email: email,    
                createdAt: new Date().toISOString(),
            });

            alert("Account created successfully");
            setError('');
            setEmail('');
            setPassword('');
            setUsername('');

        } catch (err) {
            let errorMessage = err.message; 
           switch (err.code) {
            case 'auth/email-already-in-use':
                errorMessage = '/!\\ Email already in use /!\\';
                break;
            case 'auth/invalid-email':
                errorMessage = '/!\\ Invalid Email Format /!\\';
                break;
            case 'auth/weak-password':
                errorMessage = '/!\\ Weak Password: Must be at least 6 characters /!\\';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = '/!\\ Account creation is disabled /!\\';
                break;
            case 'auth/too-many-requests':
                errorMessage = '/!\\ Too many attempts. Try again later /!\\';
                break;
            case 'auth/network-request-failed':
                errorMessage = '/!\\ Network error. Please check your connection /!\\';
                break;
            default:
                errorMessage = '/!\\ An unexpected error occurred. Please try again /!\\';
                break;
        }
        setError(errorMessage); 
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username} // Bind the username input
                        onChange={(e) => setUsername(e.target.value)} // Update state when username changes
                        required
                    />
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
                <button type="submit">Create Account</button>
            </form>
            <br></br>{error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Signup;
