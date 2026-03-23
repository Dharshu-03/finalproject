import React, { useState, useEffect } from 'react';
import Nav from './Navbar.js';
import './stats.css';
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats = () => {

    const [totalRevenue, setTotalRevenue] = useState(0);
    const [productsSold, setProductsSold] = useState(0);
    const [productsInStock, setProductsInStock] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);

    const [isWeekly, setIsWeekly] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);



    const fetchStats = async () => {
        try {
            const revenueRes = await API.get("/api/invoices/revenue-stats");
            setTotalRevenue(revenueRes.data.totalRevenue);
            setProductsSold(revenueRes.data.productsSold);

            const productStatsRes = await API.get("/api/products/stats");
            setProductsInStock(productStatsRes.data.totalProducts);

            const topRes = await API.get("/api/products/top-products");
            setTopProducts(topRes.data);


            await fetchChartData(false);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const fetchChartData = async (weekly) => {
        try {
            const endpoint = weekly ? "/api/invoices/chart-data-weekly" : "/api/invoices/chart-data";
            const chartRes = await API.get(endpoint);
            const data = weekly
                ? chartRes.data.filter(d => d.Sales > 0 || d.Purchase > 0)
                : chartRes.data;
            setChartData(data);
        } catch (err) {
            console.error("Failed to fetch chart data:", err);
        }
    };

    const handleToggle = async () => {
        const next = !isWeekly;
        setIsWeekly(next);
        await fetchChartData(next);
    };


    const getStars = (product) => {
        if (product.quantity === 0) return 1;
        if (product.quantity <= product.threshold) return 3;
        return 5;
    };

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < count ? "#F4A942" : "#ddd", fontSize: "14px" }}>★</span>
        ));
    };


    return (
        <div className="stats">
            <Nav />
            <div className="main">
                <h3>Statistics</h3>
                <hr />

                {/* Top stat cards */}
                <div className="statstop">
                    <div className="element">
                        <div className="statheading">
                            <h5>Total Revenue</h5>
                            <img src="/images/rupees.png" alt="" />
                        </div>
                        <h2>₹{totalRevenue.toLocaleString()}</h2>
                        <p>+20.1% from last month</p>
                    </div>
                    <div className="element">
                        <div className="statheading">
                            <h5>Products Sold</h5>
                            <img src="/images/creditcard.png" alt="" />
                        </div>
                        <h2>{productsSold.toLocaleString()}</h2>
                        <p>+180.1% from last month</p>
                    </div>
                    <div className="element">
                        <div className="statheading">
                            <h5>Products In Stock</h5>
                            <img src="/images/Vector.png" alt="" />
                        </div>
                        <h2>{productsInStock}</h2>
                        <p>+19% from last month</p>
                    </div>
                </div>

                {/* Chart + Top Products */}
                <div className="statsbottom">
                    <div className="sales">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3>Sales & Purchase</h3>
                            <div
                                className="weekly-btn"
                                onClick={handleToggle}
                                style={{ cursor: "pointer", userSelect: "none" }}
                            >
                                <span><img className='cal' src="/images/Calendar.png" alt="" /></span> {isWeekly ? "Monthly" : "Weekly"}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={480}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                                barCategoryGap="30%"
                                barGap={4}
                            >
                                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey={isWeekly ? "week" : "month"} axisLine={false} tickLine={false} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                                />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: "16px" }}
                                />
                                <Bar dataKey="Purchase" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Sales" fill="#4CAF82" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="products">
                        <h5>Top Products</h5>
                        <div className="top-products-list">
                            {topProducts.length === 0 ? (
                                <p style={{ color: "#888", padding: "10px 20px", fontSize: "13px" }}>No products found</p>
                            ) : (
                                topProducts.map((product) => (
                                    <div key={product._id} className="top-product-item">
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            {product.image ? (
                                                <img
                                                    src={`http://localhost:5000${product.image}`}
                                                    alt={product.name}
                                                    style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: "36px", height: "36px", borderRadius: "8px",
                                                    background: "#e0e0e0", display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontSize: "16px"
                                                }}>📦</div>
                                            )}
                                            <div>
                                                <span className="top-product-name">{product.name}</span>
                                                <div className="top-product-stars">{renderStars(getStars(product))}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;