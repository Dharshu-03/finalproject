import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'
function Otp() {
    const [password, setOtp] = useState("");
    const navigate = useNavigate();
    return (
        <AuthLayout image="/images/otppic.png" text="">
            <h2>Enter Your OTP</h2>
            <p>We’ve sent a 6-digit OTP to your registered mail.Please enter it below to sign in.</p>
            <div className="input-group">
                <label htmlFor="">E-mail</label>
                <input value={password} onChange={e => setOtp(e.target.value)} placeholder="xxxx05" /></div>
            <button className="btn" onClick={() => navigate("/reset")}>
                Confirm</button>
        </AuthLayout>
    );
}
export default Otp;