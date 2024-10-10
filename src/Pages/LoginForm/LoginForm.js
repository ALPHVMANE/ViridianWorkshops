import React, {useState} from 'react';
import './LoginForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/Firebase';

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
                setHeadingColor('red');
                setError('');
                if (email.includes('admin')) {
                    navigate("/admin");
                }
                else{
                    navigate("/home");
                }
            } catch (err) {
                let errorMessage = err.message; // Get the error message
                if (errorMessage === "Firebase: Error (auth/invalid-email)."){
                    errorMessage = '/!\\ Invalid Email Format /!\\';
                }
                else if (errorMessage === "Firebase: Error (auth/invalid-credential)."){
                    errorMessage = '/!\\ Wrong Email or Password /!\\';
                }
                setError(errorMessage);
            }
        };
    
        return (
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1 style = {{ color: headingColor }}>Login</h1>
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
                    <button type="submit">Login</button>
                    <div className="register-link">Not a member? <Link to="/signup">Register</Link> </div>
                </form>
                <br></br>{error && <p className = "error-message">{error}</p>}
            </div>
    );
}

export default LoginForm;