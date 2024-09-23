import React, { useState } from 'react';
import './Signup.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';
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
            alert("Account created successfully");
            await createUserWithEmailAndPassword(auth, email, password);
            setHeadingColor('red');
            setError('');
        } catch (err) {
            setError(err.Message);
        }
        // const auth = getAuth();
        // createUserWithEmailAndPassword(auth, email, password)
        // .then((userCredential) => {
        //     // Signed up 
        //     const user = userCredential.user;
        //     setHeadingColor('red');
        //     alert("Account created successfully");
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // ..
        // });
    };

    return (
        <div className="wrapper">
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error in red */}
            <form onSubmit={handleSubmit}>
                <h1 style={{ color: headingColor }}>Sign Up</h1> {/* Apply heading color */}
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
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};
export default Signup;