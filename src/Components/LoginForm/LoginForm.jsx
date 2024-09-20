import React from 'react';
import './LoginForm.css'

const LoginForm = () => {
    return (
        <div className = "wrapper">
            <form action="">
                <h1>Login</h1>
                <div className = "input-box">
                    <input type="text" placeholder="Username" required/>
                </div>
                <div className = "input-box">
                    <input type="password" placeholder="Password" required/>

                </div>
                <div className='remember_forgotpw'>
                    <label><input type="checkbox"/>Remember me</label><a href="#">Forgot Password</a>
                </div>
                <button type="submit">Login</button>
                <div className="register-link">Not a member? <a href="#">Register now</a></div>
            </form>
        </div>
    );
}

export default LoginForm;