import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'
function Forgot() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    return (
        <AuthLayout image="/images/Login3.png" text="">
            <h2>Company Name</h2>
            <p>
                Please enter your registered email ID to receive an OTP
            </p>
            <div className="input-group"><label>Email</label><input value={email} placeholder="Enter your registered Email" onChange={e => setEmail(e.target.value)} /></div>
            <button className="btn" onClick={() => navigate("/otp")}>Send Mail</button>
        </AuthLayout>
    );
}

export default Forgot;