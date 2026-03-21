import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'
import { useLocation } from "react-router-dom";


function Otp() {
    const [password, setOtp] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const location = useLocation();
    const email = location.state?.email;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === "111111") {

            navigate("/reset", { state: { email } });
        }
    }

    return (
        <AuthLayout image="/images/otppic.png" text="">
            <h2>Enter Your OTP</h2>
            <p>We’ve sent a 6-digit OTP to your registered mail.Please enter it below to sign in.</p>
            <div className="input-group">
                <label htmlFor="">E-mail</label>
                <input value={password} onChange={e => setOtp(e.target.value)} placeholder="xxxx05" /></div>
            <button className="btn" onClick={handleSubmit}>
                Confirm</button>
            {error && <div className="error">{error}</div>}
        </AuthLayout>
    );
}
export default Otp;