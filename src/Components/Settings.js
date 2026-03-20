import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.js'
import './Settings.css'



const Settings = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 8) return setError("Password too short");
        if (password !== confirm) return setError("Passwords do not match");
        if (fname.length < 3) return setError("first name too short");
        if (lname.length < 3) return setError("first name too short");
        setError("");
        navigate("/otp");
    };
    return (
        <>
            <div className='settings'>
                <Nav />
                <div className='main'>
                    <h3>Settings</h3>
                    <hr />
                    <div className='tab'>
                        <h2>Edit Profile</h2>
                        <hr style={{ width: "93%", marginLeft: "70px", border: "2px soid #9F9F9F" }} />
                        <form onSubmit={handleSubmit}>
                            <div className="input-group"><label>First Name</label><input value={fname} onChange={e => setfname(e.target.value)} /></div>
                            <div className="input-group"><label>Last Name</label><input value={lname} onChange={e => setlname(e.target.value)} /></div>
                            <div className="input-group"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                            <div className="input-group"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
                            <div className="input-group"><label>Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
                            {error && <div className="error">{error}</div>}

                        </form>
                        <button className="btn"> Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Settings;