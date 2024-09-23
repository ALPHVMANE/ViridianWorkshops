import React from 'react';
import './LoginForm.css';
import { Link } from 'react-router-dom';


function LoginForm() {
    return (
        <div className = "wrapper">
            <form action="">
                <h1>Login</h1>
                <div className = "input-box">
                    <input type="text" placeholder="Email" required/>
                </div>
                <div className = "input-box">
                    <input type="password" placeholder="Password" required/>

                </div>
                <div className='remember_forgotpw'>
                    <label><input type="checkbox"/>Remember me</label><a href="#">Forgot Password</a>
                </div>
                <button type="submit">Login</button>
                <div className="register-link">Not a member? <Link to="/signup">Register</Link> </div>
            </form>
        </div>
    );
}

export default LoginForm;