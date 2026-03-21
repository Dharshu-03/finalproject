import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'
import { useLocation } from "react-router-dom";
import API from "../api.js";


function Reset() {
    const [p, setP] = useState("");
    const [c, setC] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (p.length < 8) return setError("Too short");
        if (p !== c) return setError("Mismatch");

        try {
            const res = await API.post("/reset", {
                email,
                password: p
            });
        }
        catch (err) {
            setError(err.response?.data?.msg || "Login failed");
        }
        alert("Password reset");
        navigate("/");
    };

    return (
        <AuthLayout image="/images/passwordset.png">
            <h2>Reset Password</h2>
            <div className="input-group"><input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="atleast 8 characters" /></div>
            <div className="input-group"><input type="password" value={c} onChange={e => setC(e.target.value)} placeholder="atleast 8 characters" /></div>
            {error && <div className="error">{error}</div>}
            <button className="btn" onClick={handleSubmit}>Reset</button>
        </AuthLayout>
    );
}
export default Reset;