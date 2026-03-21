import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './Layout';
import API from "../api.js"

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    var fname = "";
    var lname = "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes("@")) return setError("Invalid email");
        if (password.length < 8) return setError("Password too short");
        if (password !== confirm) return setError("Passwords do not match");

        try {
            await API.post("/signup", { email, password, fname, lname });
            alert("Signup success");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Error");
        }
    };

    return (
        <AuthLayout image="/images/signup.png" text="Welcome to photontech">
            <h2>Create an account</h2>
            <p>Start inventory management.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label>Confirm</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                    />
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" className="btn">
                    Sign up
                </button>
            </form>

            <div className="text-center">
                Already have account?{" "}
                <Link to="/" className="link">Sign In</Link>
            </div>
        </AuthLayout>
    );
}

export default Signup;