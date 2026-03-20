import React from "react";
import { Link } from 'react-router-dom';
import AuthLayout from './Layout.js'

function LoginPage() {
    return (
        <AuthLayout image="/images/login.png" text="Welcome to photontech">


            <h2>Log in to your account</h2>
            <p>Welcome back! Please enter your details.</p>

            <form>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" placeholder="Example@email.com" />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="at least 8 characters" />

                    <div className="forgot">
                        <Link to="/forgot" className="link">  Forgot Password?</Link>
                    </div>
                </div>

                <Link to="/home" className="link">  <button type="submit" className="btn">Sign In</button></Link>
            </form>

            <p className="signup-text">
                Do you have an account? <Link to="/signup" className="link">Sign Up</Link>
            </p>


        </AuthLayout >
    );
}

export default LoginPage;
