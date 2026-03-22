import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Navbar.js';
import './product.css';
import API from "../../api";

const Product = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [showTypePopup, setShowTypePopup] = useState(false);
    const [showCsvPopup, setShowCsvPopup] = useState(false);
    const [csvFile, setCsvFile] = useState(null);

    // Lock scroll when any popup is open
    useEffect(() => {
        document.body.style.overflow = (showTypePopup || showCsvPopup) ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [showTypePopup, showCsvPopup]);

    const handleCsvChange = (e) => {
        if (e.target.files.length > 0) setCsvFile(e.target.files[0]);
    };

    const handleCsvDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) setCsvFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        console.log("🔥 handleUpload called", csvFile);
        if (!csvFile) return;

        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const res = await API.post("/api/products/upload-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log(res.data);
            alert("CSV uploaded successfully");
            setCsvFile(null);
            setShowCsvPopup(false);
        } catch (err) {
            console.error("Upload error:", err.response?.data || err.message);
            alert("Upload failed: " + (err.response?.data?.error || err.message));
        }
    };
    return (
        <div className="product">
            <Nav />

            <div className={`productmain ${(showTypePopup || showCsvPopup) ? 'blurred' : ''}`}>
                <div className="header">
                    <h3>Product</h3>
                    <div className="search">
                        <img src="/images/magnify.png" alt="" />
                        <input
                            type="search"
                            placeholder="Search here..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="productcontent">
                    <hr />
                    <div className="overall"></div>
                    <div className="list">
                        <div className="listheader">
                            <h3>Products</h3>
                            <div className="btn" onClick={() => setShowTypePopup(true)}>Add product</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* First popup: select product type */}
            {showTypePopup && (
                <div className="popup-overlay" onClick={() => setShowTypePopup(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <h3>Select Product Type</h3>
                        <div className="popup-buttons">
                            <button onClick={() => { setShowTypePopup(false); navigate("/add-individual"); }}>
                                Individual Product
                            </button>
                            <button onClick={() => { setShowTypePopup(false); setShowCsvPopup(true); }}>
                                Multiple Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Second popup: CSV upload */}
            {showCsvPopup && (
                <div className="popup-overlay" onClick={() => setShowCsvPopup(false)}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <div className="csvheading">
                            <h3>CSV Upload</h3>
                            <p>Add your document here</p>
                        </div>

                        <div
                            className="csv-upload-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleCsvDrop}
                        >
                            <img src="/images/csv.png" alt="" />
                            <br />

                            <>
                                <p>Drag your file(s) to start uploading</p>
                                <p>OR</p>
                            </>


                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleCsvChange}
                                style={{ display: 'none' }}
                                id="csv-input"

                            />
                            <label htmlFor="csv-input" className="browse-btn">
                                Browse
                            </label>
                        </div>


                        {csvFile && (
                            <div className="file-preview">
                                <div>
                                    <img src="/images/csvfile.png" alt="" />
                                    <div className='csvdetails'>
                                        <h1 className="file-name">{csvFile.name}</h1>
                                        <p className="file-size">
                                            {(csvFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <span className="remove-file" onClick={() => setCsvFile(null)}>✕</span>



                            </div>
                        )}

                        <div className="csv-buttons">
                            <button onClick={() => setShowCsvPopup(false)}>Cancel</button>
                            <button
                                style={{ zIndex: 9999, position: "relative" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("🔥 button clicked", csvFile);
                                    if (csvFile) handleUpload();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default Product;