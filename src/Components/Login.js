import React, { useState } from "react";
import { Link } from 'react-router-dom';
import AuthLayout from './Layout.js';
import { useNavigate } from 'react-router-dom';
import API from "../api.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            return setError("All fields are required");
        }


        try {
            const res = await API.post("/api/auth/login", {
                email,
                password,
            });
            localStorage.setItem("email", res.data.user.email);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));


            alert("Login successful");
            navigate("/home")


        } catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <AuthLayout image="/images/login.png" text="Welcome to photontech">
            <h2>Log in to your account</h2>
            <p>Welcome back! Please enter your details.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="at least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="forgot">
                        <Link to="/forgot" className="link">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="btn">
                    Sign In
                </button>
            </form>

            <p className="signup-text">
                Don't have an account?{" "}
                <Link to="/signup" className="link">Sign Up</Link>
            </p>
        </AuthLayout>
    );
}

export default Login;