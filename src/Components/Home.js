import React, { useState, useEffect } from 'react';
import Nav from './Navbar.js';
import './home.css';
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home = () => {

    // Sales Overview
    const [totalSales, setTotalSales] = useState(0);         // total products in DB
    const [totalRevenue, setTotalRevenue] = useState(0);     // total cost of all products (price * qty)
    const [totalProfit, setTotalProfit] = useState(0);       // revenue - invoice cost

    // Inventory Summary
    const [productsInStock, setProductsInStock] = useState(0); // total products in DB

    // Purchase Overview
    const [totalInvoices, setTotalInvoices] = useState(0);       // number of invoices
    const [totalInvoiceCost, setTotalInvoiceCost] = useState(0); // total amount of all invoices

    // Product Summary
    const [totalCategories, setTotalCategories] = useState(0);

    const [topProducts, setTopProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isWeekly, setIsWeekly] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // --- Product stats ---
            const productStatsRes = await API.get("/api/products/stats");
            const { totalProducts, totalAmount, categories } = productStatsRes.data;

            setProductsInStock(totalProducts);  // Inventory > In Stock
            setTotalSales(totalProducts);       // Sales Overview > Sales
            setTotalRevenue(totalAmount);       // Sales Overview > Revenue
            setTotalCategories(categories);     // Product Summary > Categories

            // --- Invoice stats ---
            const invoiceStatsRes = await API.get("/api/invoices/stats");
            const { totalInvoices: invCount, totalAmount: invAmount } = invoiceStatsRes.data;

            setTotalInvoices(invCount);         // Purchase Overview > Purchases
            setTotalInvoiceCost(invAmount);     // Purchase Overview > Cost

            // Profit = product revenue - invoice cost
            setTotalProfit(totalAmount - invAmount);

            // --- Top Products ---
            const topRes = await API.get("/api/products/top-products");
            setTopProducts(topRes.data);

            // --- Chart ---
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

    const formatCurrency = (val) =>
        `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    return (
        <div className="stats">
            <Nav />
            <div className="main">
                <h3>Home</h3>
                <hr />

                <div className="homeheader">
                    <div className="hstats">
                        {/* Sales Overview */}
                        <div className="hoverview">
                            <div>
                                <h3>Sales Overview</h3>
                            </div>
                            <div className='hcardcollection'>
                                <div className="hcards">
                                    <img src="/images/i1.png" alt="" />
                                    <h5>{totalSales}</h5>
                                    <p>Sales</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i2.png" alt="" />
                                    <h5>{formatCurrency(totalRevenue)}</h5>
                                    <p>Revenue</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i3.png" alt="" />
                                    <h5>{formatCurrency(totalProfit)}</h5>
                                    <p>Profit</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i4.png" alt="" />
                                    {/* Cost hardcoded as 0 */}
                                    <h5>₹0</h5>
                                    <p>Cost</p>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Summary */}
                        <div className="hsummary">
                            <div>
                                <h3>Inventory Summary</h3>
                            </div>
                            <div className='hcardcollection'>
                                <div className="hcards">
                                    <img src="/images/i5.png" alt="" />
                                    <h5>{productsInStock}</h5>
                                    <p>In Stock</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i6.png" alt="" />
                                    {/* To be Received hardcoded as 0 */}
                                    <h5>0</h5>
                                    <p>To be Received</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hstats">
                        {/* Purchase Overview */}
                        <div className="hoverview">
                            <div>
                                <h3>Purchase Overview</h3>
                            </div>
                            <div className='hcardcollection'>
                                <div className="hcards">
                                    <img src="/images/i7.png" alt="" />
                                    <h5>{totalInvoices}</h5>
                                    <p>Purchases</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i8.png" alt="" />
                                    <h5>{formatCurrency(totalInvoiceCost)}</h5>
                                    <p>Cost</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i9.png" alt="" />
                                    {/* Cancel hardcoded as 0 */}
                                    <h5>0</h5>
                                    <p>Cancel</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i10.png" alt="" />
                                    {/* Return hardcoded as 0 */}
                                    <h5>0</h5>
                                    <p>Return</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Summary */}
                        <div className="hsummary">
                            <div>
                                <h3>Product Summary</h3>
                            </div>
                            <div className='hcardcollection'>
                                <div className="hcards">
                                    <img src="/images/i11.png" alt="" />
                                    {/* Number of Suppliers hardcoded as 0 */}
                                    <h5>0</h5>
                                    <p>Number of suppliers</p>
                                </div>
                                <div className="hcards">
                                    <img src="/images/i12.png" alt="" />
                                    <h5>{totalCategories}</h5>
                                    <p>Number of Categories</p>
                                </div>
                            </div>
                        </div>
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

export default Home;