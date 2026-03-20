import React, { useState } from "react";
import './Login.css';

// Reusable Layout
function Layout({ children, text, image }) {
    return (
        <div className="container">
            <div className="left">
                <div className="form-box">{children}</div>
            </div>
            <div className="right">


                {text && (
                    <div className="cname">
                        <h1>{text}</h1>
                        <img src="./images/circle.png" alt="" />
                    </div>)}

                <img src=
                    {image}
                    alt="" />
            </div>


        </div>
    );
}

export default Layout;