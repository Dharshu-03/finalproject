import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'

function Reset() {
    const [p, setP] = useState("");
    const [c, setC] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handle = () => {
        if (p.length < 8) return setError("Too short");
        if (p !== c) return setError("Mismatch");
        alert("Password reset");
        navigate("/");
    };

    return (
        <AuthLayout image="/images/passwordset.png">
            <h2>Reset Password</h2>
            <div className="input-group"><input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="atleast 8 characters" /></div>
            <div className="input-group"><input type="password" value={c} onChange={e => setC(e.target.value)} placeholder="atleast 8 characters" /></div>
            {error && <div className="error">{error}</div>}
            <button className="btn" onClick={handle}>Reset</button>
        </AuthLayout>
    );
}
export default Reset;