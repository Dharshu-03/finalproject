import React, { useState, useEffect, useRef } from 'react';
import Nav from './Navbar.js';
import API from "../api";
import './invoice.css'

const Invoice = () => {
    const [search, setSearch] = useState("");
    const [invoices, setInvoices] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        recentTransactions: 0,
        totalInvoices: 0,
        totalAmount: 0,
        paidCount: 0,
        paidAmount: 0,
        unpaidCount: 0,
        unpaidAmount: 0,
    });

    // Popup states
    const [ellipsisOpenId, setEllipsisOpenId] = useState(null);  // which row's ellipsis is open
    const [statusPopupId, setStatusPopupId] = useState(null);     // unpaid status popup
    const [viewInvoice, setViewInvoice] = useState(null);         // invoice to view
    const [deleteInvoice, setDeleteInvoice] = useState(null);
    const [deletePopupPos, setDeletePopupPos] = useState({ top: 0, left: 0 });
    const ellipsisRef = useRef(null);

    useEffect(() => {
        fetchInvoices(1);
        fetchStats();
    }, []);

    // Close ellipsis popup on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ellipsisRef.current && !ellipsisRef.current.contains(e.target)) {
                setEllipsisOpenId(null);
                setStatusPopupId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchInvoices = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await API.get(`/api/invoices?page=${pageNum}`);
            setInvoices(res.data.invoices);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
        } catch (err) {
            console.error("Failed to fetch invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await API.get("/api/invoices/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch invoice stats:", err);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d)) return "-";
        return `${d.getDate()}-${d.toLocaleString('default', { month: 'short' })}-${String(d.getFullYear()).slice(2)}`;
    };

    const handleToggleStatus = async (invoice) => {
        if (invoice.status === "paid") return; // ✅ block toggling back
        try {
            await API.patch(`/api/invoices/${invoice._id}/status`, { status: "paid" });
            setInvoices(prev => prev.map(inv =>
                inv._id === invoice._id ? { ...inv, status: "paid" } : inv
            ));
            fetchStats();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await API.delete(`/api/invoices/${deleteInvoice._id}`);
            setDeleteInvoice(null);
            setEllipsisOpenId(null);
            fetchInvoices(page);
            fetchStats();
        } catch (err) {
            alert("Failed to delete invoice");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const content = document.getElementById("invoice-print-area").innerHTML;
        const win = window.open('', '', 'width=800,height=900');
        win.document.write('<html><head><title>Invoice</title></head><body>' + content + '</body></html>');
        win.document.close();
        win.print();
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceId?.toLowerCase().includes(search.toLowerCase()) ||
        inv.productName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="invoice">
            <Nav />

            <div className="invoicemain">
                <div className="header">
                    <h3>Invoice</h3>
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

                <div className="invoicecontent">
                    <hr />

                    {/* Overall Invoice Stats */}
                    <div className="overall">
                        <h3>Overall Invoice</h3>
                        <div className="osub">
                            <div className="overallsub">
                                <h5>Recent Transactions</h5>
                                <div className="data">
                                    <p>{stats.recentTransactions}</p>
                                </div>

                            </div>
                            <div className="overallsub">
                                <h5>Total Invoices</h5>
                                <div className="data">
                                    <p>{stats.totalInvoices}</p>
                                    <p>{stats.paidCount}</p>
                                </div>

                            </div>
                            <div className="overallsub">
                                <h5>Paid Amount</h5>
                                <div className="data">
                                    <p>₹{stats.paidAmount.toLocaleString()}</p>
                                    <p>{stats.paidCount}</p>
                                </div>

                            </div>
                            <div className="overallsub">
                                <h5>Unpaid Amount</h5>
                                <div className="data">
                                    <p>₹{stats.unpaidAmount.toLocaleString()}</p>
                                    <p>{stats.unpaidCount}</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Invoice Table */}
                    <div className="list">
                        <div className="listheader">
                            <h3>Invoices List</h3>
                        </div>

                        {loading ? (
                            <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
                        ) : (
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Reference Number</th>
                                        <th>Amount (₹)</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                                                No invoices found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInvoices.map((invoice) => (
                                            <tr key={invoice._id}>
                                                <td>{invoice.invoiceId}</td>
                                                <td>{invoice.productName}</td>
                                                <td>₹ {invoice.amount.toLocaleString()}</td>
                                                <td style={{
                                                    color: invoice.status === "paid" ? "#4CAF82" : "#F36A6A",
                                                    fontWeight: 500
                                                }}>
                                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                </td>
                                                <td style={{ position: "relative" }}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                        <span>{formatDate(invoice.dueDate)}</span>

                                                        {/* Ellipsis button */}
                                                        <div style={{ position: "relative" }} ref={ellipsisOpenId === invoice._id ? ellipsisRef : null}>
                                                            <button
                                                                className="ellipsis-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (ellipsisOpenId === invoice._id) {
                                                                        setEllipsisOpenId(null);
                                                                        setStatusPopupId(null);
                                                                    } else {
                                                                        setEllipsisOpenId(invoice._id);
                                                                        setStatusPopupId(null);
                                                                    }
                                                                }}
                                                            >⋮</button>

                                                            {/* Unpaid invoice ellipsis → status toggle popup */}
                                                            {ellipsisOpenId === invoice._id && invoice.status === "unpaid" && (
                                                                <div className="ellipsis-popup" onClick={(e) => e.stopPropagation()}>
                                                                    <button
                                                                        className="status-toggle-btn unpaid-btn"
                                                                        onClick={() => handleToggleStatus(invoice)}
                                                                    >
                                                                        Unpaid
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Paid invoice ellipsis → view/delete only, no toggle back */}
                                                            {ellipsisOpenId === invoice._id && invoice.status === "paid" && (
                                                                <div className="ellipsis-popup" onClick={(e) => e.stopPropagation()}>
                                                                    <div className="invoicepop">
                                                                        <img src="/images/viewinvoice.png" alt="" />
                                                                        <button
                                                                            className="ellipsis-action-btn"
                                                                            onClick={() => {
                                                                                setViewInvoice(invoice);
                                                                                setEllipsisOpenId(null);
                                                                            }}
                                                                        >
                                                                            View Invoice
                                                                        </button>
                                                                    </div>

                                                                    <div className="invoicepop">
                                                                        <img src="/images/delinvoice.png" alt="" />
                                                                        <button
                                                                            className="ellipsis-action-btn"
                                                                            onClick={(e) => {
                                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                                setDeletePopupPos({
                                                                                    top: rect.bottom + window.scrollY - 90,
                                                                                    left: (rect.left) + window.scrollX - 100
                                                                                });
                                                                                setDeleteInvoice(invoice);
                                                                                setEllipsisOpenId(null);
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        <div className="pagination">
                            <button onClick={() => fetchInvoices(page - 1)} disabled={page <= 1}>Previous</button>
                            <span>Page {page} of {totalPages}</span>
                            <button onClick={() => fetchInvoices(page + 1)} disabled={page >= totalPages}>Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Invoice Popup */}
            {viewInvoice && (
                <div className="popup-overlay" onClick={() => setViewInvoice(null)}>
                    <div className="invoice-view-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="invoice-view-actions">
                            <div className="inv-action-btn close-btn">
                                <img src='/images/close.png' onClick={() => setViewInvoice(null)} />
                            </div>
                            <div className='inv-action-btn download-btn'>
                                <img src='/images/dow.png' onClick={handleDownload} />
                            </div>
                            <div className='inv-action-btn print-btn'>
                                <img src='/images/print.png' onClick={handlePrint} />
                            </div>

                        </div>

                        <div id="invoice-print-area" className="invoice-print-content">
                            <div className="invoice-heading">
                                <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "24px" }}>INVOICE</h1>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: "4px" }}>Billed to</p>
                                        <p style={{ fontWeight: 600 }}>Company Name</p>
                                        <p style={{ color: "#888" }}>Company address</p>
                                        <p style={{ color: "#888" }}>City, Country - 00000</p>
                                    </div>
                                    <div style={{ textAlign: "right", color: "#888" }}>
                                        <p>Business address</p>
                                        <p>City, State, IN - 000 000</p>
                                        <p>TAX ID 00XXXXX1234X0XX</p>
                                    </div>
                                </div>
                            </div>
                            <div className="invoicepopcontent">
                                <div className='invoicepopdetails'>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: "5px 10px" }}>Invoice #</p>
                                        <p>{viewInvoice.invoiceId}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: "5px 10px" }}>Invoice date</p>
                                        <p>{formatDate(viewInvoice.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: "5px 10px" }}>Reference</p>
                                        <p>{viewInvoice.productName}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: "5px 10px" }}>Due date</p>
                                        <p>{formatDate(viewInvoice.dueDate)}</p>
                                    </div>
                                </div>
                                <div className="invoicepopbottom">
                                    <table >
                                        <thead>
                                            <tr style={{ borderBottom: "1px solid #eee" }}>
                                                <th>Products</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td >{viewInvoice.productName}</td>
                                                <td >{viewInvoice.quantity}</td>
                                                <td >₹{viewInvoice.amount.toLocaleString()}</td>
                                            </tr>

                                        </tbody>
                                    </table>

                                    <div className='invoicepopsubtotal'>
                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <span>Subtotal</span>
                                                <span>₹{viewInvoice.amount.toLocaleString()}</span>

                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                                <span>Tax (10%)</span>
                                                <span>₹{Math.round(viewInvoice.amount * 0.1).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#4CAF82", fontSize: "16px" }}>
                                            <p>Total due</p>
                                            <p>₹{viewInvoice.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                        <img style={{ height: "10px", width: "10px" }} src="/images/tick.png" alt="" />
                                        <p style={{ fontSize: "12px", color: "#888" }}>
                                            Please pay within 7 days of receiving this invoice.
                                        </p>
                                    </div>

                                </div>


                            </div>
                            <div className="footer">
                                <p>www.recehtol.inc</p>
                                <p>+91 00000 00000</p>
                                <p>hello@email.com</p>
                            </div>
                        </div>

                    </div>
                </div>
            )
            }

            {deleteInvoice && (
                <div
                    className="delete-confirm-popup"
                    style={{
                        position: "fixed",
                        top: deletePopupPos.top,
                        left: deletePopupPos.left - 200,
                        zIndex: 1001,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <p>this invoice will be deleted.</p>
                    <div className="delete-confirm-btns">
                        <button onClick={() => setDeleteInvoice(null)}>Cancel</button>
                        <button className="confirm-delete-btn" onClick={handleDelete}>Confirm</button>
                    </div>
                </div>
            )}

            {/* backdrop to close on outside click */}
            {deleteInvoice && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 1000 }}
                    onClick={() => setDeleteInvoice(null)}
                />
            )}
        </div >
    );
};

export default Invoice;






























// import React, { useState, useEffect } from 'react';
// import Nav from './Navbar.js';
// import API from "../api";
// import './invoice.css';

// const Invoice = () => {
//     const [search, setSearch] = useState("");
//     const [invoices, setInvoices] = useState([]);
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [stats, setStats] = useState({
//         recentTransactions: 0,
//         totalInvoices: 0,
//         totalAmount: 0,
//         paidCount: 0,
//         paidAmount: 0,
//         unpaidCount: 0,
//         unpaidAmount: 0,
//     });

//     useEffect(() => {
//         fetchInvoices(1);
//         fetchStats();
//     }, []);

//     const fetchInvoices = async (pageNum = 1) => {
//         setLoading(true);
//         try {
//             const res = await API.get(`/api/invoices?page=${pageNum}`);
//             setInvoices(res.data.invoices);
//             setTotalPages(res.data.totalPages);
//             setPage(res.data.page);
//         } catch (err) {
//             console.error("Failed to fetch invoices:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchStats = async () => {
//         try {
//             const res = await API.get("/api/invoices/stats");
//             setStats(res.data);
//         } catch (err) {
//             console.error("Failed to fetch invoice stats:", err);
//         }
//     };

//     const formatDate = (dateStr) => {
//         const d = new Date(dateStr);
//         if (isNaN(d)) return "-";
//         return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
//     };

//     const getStatusStyle = (status) => {
//         if (status === "paid") return { color: "#4CAF82", fontWeight: 500 };
//         return { color: "#F36A6A", fontWeight: 500 };
//     };

//     const filteredInvoices = invoices.filter(inv =>
//         inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
//         inv.productName.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className="invoice">
//             <Nav />

//             <div className="invoicemain">
//                 <div className="header">
//                     <h3>Invoice</h3>
//                     <div className="search">
//                         <img src="/images/magnify.png" alt="" />
//                         <input
//                             type="search"
//                             placeholder="Search here..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <div className="invoicecontent">
//                     <hr />

//                     {/* Overall Invoice Stats */}
//                     <div className="overall">
//                         <h3>Overall Invoice</h3>
//                         <div className="osub">
//                             <div className="overallsub">
//                                 <h5>Recent Transactions</h5>
//                                 <div className="data">
//                                     <p>{stats.recentTransactions}</p>
//                                 </div>
//                             </div>
//                             <div className="overallsub">
//                                 <h5>Total Invoices</h5>
//                                 <div className="data">
//                                     <p>{stats.totalInvoices}</p>
//                                     <p>₹{stats.totalAmount.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                             <div className="overallsub">
//                                 <h5>Paid Amount</h5>
//                                 <div className="data">
//                                     <p>{stats.paidCount}</p>
//                                     <p>₹{stats.paidAmount.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                             <div className="overallsub">
//                                 <h5>Unpaid Amount</h5>
//                                 <div className="data">
//                                     <p>{stats.unpaidCount}</p>
//                                     <p>₹{stats.unpaidAmount.toLocaleString()}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Invoice Table */}
//                     <div className="list">
//                         <div className="listheader">
//                             <h3>Invoice List</h3>
//                         </div>

//                         {loading ? (
//                             <p style={{ padding: "20px", color: "#888" }}>Loading...</p>
//                         ) : (
//                             <table className="product-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Invoice ID</th>
//                                         <th>Reference Number</th>
//                                         <th>Amount</th>
//                                         <th>Status</th>
//                                         <th>Due Date</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredInvoices.length === 0 ? (
//                                         <tr>
//                                             <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
//                                                 No invoices found
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         filteredInvoices.map((invoice) => (
//                                             <tr key={invoice._id}>
//                                                 <td>{invoice.invoiceId}</td>
//                                                 <td>{invoice.productName}</td>
//                                                 <td>₹{invoice.amount.toLocaleString()}</td>
//                                                 <td style={getStatusStyle(invoice.status)}>
//                                                     {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
//                                                 </td>
//                                                 <td>{formatDate(invoice.dueDate)}</td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>
//                         )}

//                         <div className="pagination">
//                             <button onClick={() => fetchInvoices(page - 1)} disabled={page <= 1}>
//                                 Previous
//                             </button>
//                             <span>Page {page} of {totalPages}</span>
//                             <button onClick={() => fetchInvoices(page + 1)} disabled={page >= totalPages}>
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Invoice;