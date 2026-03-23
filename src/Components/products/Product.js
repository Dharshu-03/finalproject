import React, { useState, useEffect, useRef } from 'react';
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
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showSimulatePopup, setShowSimulatePopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [buyQuantity, setBuyQuantity] = useState("");
    const [stats, setStats] = useState({
        categories: 0,
        totalProducts: 0,
        totalAmount: 0,
        topSellingCount: 0,
        topSellingAmount: 0,
        lowStockCount: 0,
        lowStockAmount: 0,
    });

    const debounceTimer = useRef(null);

    useEffect(() => {
        fetchProducts(1, search);
        fetchStats();
    }, []);

    // Debounced search — waits 400ms after user stops typing, then fetches
    useEffect(() => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchProducts(1, search);
        }, 400);
        return () => clearTimeout(debounceTimer.current);
    }, [search]);

    useEffect(() => {
        document.body.style.overflow = (showTypePopup || showCsvPopup) ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [showTypePopup, showCsvPopup]);

    const fetchStats = async () => {
        try {
            const res = await API.get("/api/products/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const handleBuy = async () => {
        if (!buyQuantity || buyQuantity <= 0) return alert("Enter a valid quantity");
        if (buyQuantity > selectedProduct.quantity) return alert("Not enough stock");

        try {
            await API.patch(`/api/products/${selectedProduct._id}/buy`, {
                quantity: Number(buyQuantity)
            });
            alert("Purchase successful");
            setShowSimulatePopup(false);
            setBuyQuantity("");
            fetchProducts(page, search);
            fetchStats();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.error || err.message));
        }
    };

    const fetchProducts = async (pageNum = 1, searchTerm = "") => {
        setLoading(true);
        try {
            const res = await API.get(`/api/products`, {
                params: { page: pageNum, search: searchTerm }
            });
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    const getAvailability = (product) => {
        if (product.quantity === 0) return { label: "Out of stock", color: "#F36A6A" };
        if (product.quantity <= product.threshold) return { label: "Low stock", color: "#F4A942" };
        return { label: "In-stock", color: "#4CAF82" };
    };

    const highlightMatch = (text, query) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.trim()})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part)
                ? <mark key={i} style={{ backgroundColor: "#FFF176", borderRadius: "3px", padding: "0 2px" }}>{part}</mark>
                : part
        );
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    };

    const handleCsvChange = (e) => {
        if (e.target.files.length > 0) setCsvFile(e.target.files[0]);
    };

    const handleCsvDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) setCsvFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
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
            fetchProducts(1, search);
            fetchStats();
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

                    {/* Overall Inventory */}
                    <div className="overall">
                        <h3>Overall Inventory</h3>
                        <div className="osub">
                            <div className="overallsub">
                                <h5>Categories</h5>
                                <div className="data">
                                    <p>{stats.categories}</p>
                                </div>
                            </div>
                            <div className="overallsub">
                                <h5>Total Products</h5>
                                <div className="data">
                                    <p>{stats.totalProducts}</p>
                                    <p>₹{stats.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="overallsub">
                                <h5>Top Selling</h5>
                                <div className="data">
                                    <p>{stats.topSellingCount}</p>
                                    <p>₹{stats.topSellingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="overallsub">
                                <h5>Low Stocks</h5>
                                <div className="data">
                                    <p>{stats.lowStockCount}</p>
                                    <p>₹{stats.lowStockAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="list">
                        <div className="listheader">
                            <h3>Products</h3>
                            <div className="btn" onClick={() => setShowTypePopup(true)}>Add product</div>
                        </div>

                        {loading ? (
                            <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                        ) : (
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Products</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Threshold Value</th>
                                        <th>Expiry Date</th>
                                        <th>Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                {search ? `No products found for "${search}"` : "No products found"}
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => {
                                            const availability = getAvailability(product);
                                            return (
                                                <tr key={product._id}>
                                                    <td style={{ cursor: "pointer", color: "#292929", fontWeight: 500 }}
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setBuyQuantity("");
                                                            setShowSimulatePopup(true);
                                                        }}>{highlightMatch(product.name, search)}</td>
                                                    <td>₹{product.price}</td>
                                                    <td>{product.quantity} {product.unit}</td>
                                                    <td>{product.threshold}</td>
                                                    <td>{formatDate(product.expiryDate)}</td>
                                                    <td style={{ color: availability.color, fontWeight: 500 }}>
                                                        {availability.label}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* Hide pagination when searching */}
                        {!search && (
                            <div className="pagination">
                                <button onClick={() => fetchProducts(page - 1, "")} disabled={page <= 1}>
                                    Previous
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button onClick={() => fetchProducts(page + 1, "")} disabled={page >= totalPages}>
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* First popup */}
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

            {/* CSV upload popup */}
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
                            <label htmlFor="csv-input" className="browse-btn">Browse</label>
                        </div>

                        {csvFile && (
                            <div className="file-preview">
                                <div>
                                    <img src="/images/csvfile.png" alt="" />
                                    <div className='csvdetails'>
                                        <h1 className="file-name">{csvFile.name}</h1>
                                        <p className="file-size">{(csvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
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
                                    if (csvFile) handleUpload();
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSimulatePopup && selectedProduct && (
                <div className="popup-overlay" onClick={() => setShowSimulatePopup(false)}>
                    <div className="popup simulate-popup" onClick={(e) => e.stopPropagation()}>
                        <h3>Simulate Buy Product</h3>
                        <input
                            type="number"
                            placeholder="Enter quantity"
                            value={buyQuantity}
                            onChange={(e) => setBuyQuantity(e.target.value)}
                            className="simulate-input"
                        />
                        <button className='buyproduct'
                            style={{ zIndex: 9999, position: "relative" }}
                            onClick={(e) => { e.stopPropagation(); handleBuy(); }}
                        >
                            Buy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;