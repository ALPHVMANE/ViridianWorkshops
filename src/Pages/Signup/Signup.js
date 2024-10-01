import React, { useState } from 'react';
import './Signup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/Firebase';
import { getFirestore, setDoc, doc } from "firebase/firestore";


const db = getFirestore();
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [headingColor, setHeadingColor] = useState('white'); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (password !== password2) {
        //     return setError('Passwords do not match');
        // }
        try {
        
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully");
            setError('');
        } catch (err) {
            let errorMessage = err.message; // Get the error message
            if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
                errorMessage = '/!\\ Email already in use /!\\';
            }
            else if (errorMessage === "Firebase: Error (auth/invalid-email)."){
                errorMessage = '/!\\ Invalid Email Format /!\\';
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
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                    />
                </div> */}
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* <div className="input-box">
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div> */}
                <button type="submit">Create Account</button>
            </form>
            <br></br>{error && <p className = "error-message">{error}</p>}
        </div>

    );
};
export default Signup;