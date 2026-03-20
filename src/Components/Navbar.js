import React from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <>
            <div className='nav'>
                <div className="top">
                    <img src="./images/circle.png" alt="" />

                    <hr />
                    <Link to="/home">  <div className="sub">
                        <img src="./images/home1.png" alt="" />
                        <h4>Home</h4>
                    </div>
                    </Link>
                    <Link to="/product">  <div className="sub">
                        <img src="./images/product.png" alt="" />
                        <h4>Product</h4>
                    </div></Link>
                    <Link to="/invoice"><div className="sub">
                        <img src="./images/invoice.png" alt="" />
                        <h4>Invoice</h4>
                    </div></Link>

                    <Link to="/stats"> <div className="sub">
                        <img src="./images/stats.png" alt="" />
                        <h4>Statistics</h4>
                    </div></Link>

                    <Link to="/settings"><div className="sub">
                        <img src="./images/settings.png" alt="" />
                        <h4>Settings</h4>
                    </div></Link>

                </div>
                <div>
                    <hr />
                    <div className="profile">

                        <img src="./images/profile.jpg" alt="" />
                        <h4>aaaaaa</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar;