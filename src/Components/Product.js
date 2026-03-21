import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from './Navbar.js'
import API from "../api.js";
import { useEffect } from "react";
import './product.css'
const Product = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const handleOverlayClick = () => setShowPopup(false);
    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup in case component unmounts while popup is open
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showPopup]);
    return (
        <>

            <div className="product">
                <Nav />
                <div className={`productmain ${showPopup ? 'blurred' : ''}`}>
                    <div className="header">
                        <h3>Product</h3>
                        <div className="search">
                            <img src="/images/magnify.png" alt="" />
                            <input type="search" id="search-input" placeholder="Search here..." value={search}
                                onChange={(e) => setSearch(e.target.value)}></input>
                        </div>


                    </div>
                    <div className="productcontent">
                        <hr />

                        <div className="overall"></div>

                        <div className="list">
                            <div className="listheader">
                                <h3>Products</h3>
                                <div className="btn" onClick={() => setShowPopup(true)}>Add product</div>

                            </div>
                        </div>

                    </div>
                </div>
                {showPopup && (
                    <div className="popup-overlay" onClick={handleOverlayClick}>

                        <div className="popup">
                            <div className="popup-buttons">
                                <button onClick={() => { setShowPopup(false); navigate("/add-individual"); }}>
                                    Individual Product
                                </button>
                                <button onClick={() => { setShowPopup(false); navigate("/add-multiple"); }}>
                                    Multiple Product
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>

        </>
    )
}


export default Product;