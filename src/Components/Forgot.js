import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './Layout'
import API from "../api.js";
function Forgot() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return setError("Email is required");
        }
        try {
            await API.post("/api/auth/forgot", { email });
            navigate("/Otp", { state: { email } });
        }
        catch (err) {
            setError(err.response?.data?.msg || "Error");
        }
    }


    return (
        <AuthLayout image="/images/Login3.png" text="">
            <h2>Company Name</h2>
            <p className="fmobile">
                Please enter your registered email ID to receive an OTP
            </p>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input value={email} placeholder="Enter your registered Email" onChange={e => setEmail(e.target.value)} />
                </div>
                <button className="btn" type="submit">Send Mail</button>
                {error && <div className="error">{error}</div>}
            </form>

        </AuthLayout >
    );
}

export default Forgot;