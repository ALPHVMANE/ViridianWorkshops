import React, {useState} from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

const LoginForm = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [headingColor, setHeadingColor] = useState('white'); 
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
            
                await signInWithEmailAndPassword(auth, email, password);
                alert("Account created successfully");
                setError('');
            } catch (err) {
                let errorMessage = err.message; // Get the error message
                setError(errorMessage);
            }
        };
    
        return (
            <div>
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Create Account</button>
                    <div className="register-link">Not a member? <Link to="/signup">Register</Link> </div>
                </form>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error in red */}
        </div>
    );
}

export default LoginForm;