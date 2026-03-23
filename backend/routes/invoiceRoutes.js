import express from "express";
import auth from "../middleware/auth.js";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 9;
        const skip = (page - 1) * limit;
        const total = await Invoice.countDocuments({ userId: req.userId });
        const invoices = await Invoice.find({ userId: req.userId })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ invoices, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/stats", auth, async (req, res) => {
    try {
        const all = await Invoice.find({ userId: req.userId });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentTransactions = all.filter(inv => new Date(inv.createdAt) >= sevenDaysAgo).length;
        const totalInvoices = all.length;
        const totalAmount = all.reduce((sum, inv) => sum + inv.amount, 0);
        const paid = all.filter(inv => inv.status === "paid");
        const unpaid = all.filter(inv => inv.status === "unpaid");
        const paidCount = paid.length;
        const paidAmount = paid.reduce((sum, inv) => sum + inv.amount, 0);
        const unpaidCount = unpaid.length;
        const unpaidAmount = unpaid.reduce((sum, inv) => sum + inv.amount, 0);

        res.json({ recentTransactions, totalInvoices, totalAmount, paidCount, paidAmount, unpaidCount, unpaidAmount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update status
router.patch("/:id/status", auth, async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status: req.body.status },
            { new: true }
        );
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete invoice
router.delete("/:id", auth, async (req, res) => {
    try {
        await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ message: "Invoice deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/revenue-stats", auth, async (req, res) => {
    try {
        const allInvoices = await Invoice.find({ userId: req.userId });
        const totalRevenue = allInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const productsSold = allInvoices.reduce((sum, inv) => sum + inv.quantity, 0);
        res.json({ totalRevenue, productsSold });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.get("/chart-data", auth, async (req, res) => {
    try {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Sales = invoices
        const invoices = await Invoice.find({ userId: req.userId });
        const salesMap = {};
        invoices.forEach(inv => {
            const month = monthNames[new Date(inv.createdAt).getMonth()];
            salesMap[month] = (salesMap[month] || 0) + inv.amount;
        });

        // Purchases = products added to inventory
        const products = await Product.find({ userId: req.userId });
        const purchaseMap = {};
        products.forEach(p => {
            const month = monthNames[new Date(p.createdAt).getMonth()];
            purchaseMap[month] = (purchaseMap[month] || 0) + (p.price * p.quantity);
        });

        const chartData = monthNames.map(month => ({
            month,
            Sales: salesMap[month] || 0,
            Purchase: purchaseMap[month] || 0,
        }));

        res.json(chartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/chart-data-weekly", auth, async (req, res) => {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Start and end of current month
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

        const invoices = await Invoice.find({
            userId: req.userId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const products = await Product.find({
            userId: req.userId,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Group by week (Week 1 = days 1-7, Week 2 = 8-14, etc.)
        const getWeek = (date) => {
            const day = new Date(date).getDate();
            return `Week ${Math.ceil(day / 7)}`;
        };

        const salesMap = {};
        invoices.forEach(inv => {
            const week = getWeek(inv.createdAt);
            salesMap[week] = (salesMap[week] || 0) + inv.amount;
        });

        const purchaseMap = {};
        products.forEach(p => {
            const week = getWeek(p.createdAt);
            purchaseMap[week] = (purchaseMap[week] || 0) + (p.price * p.quantity);
        });

        const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
        const chartData = weeks.map(week => ({
            week,
            Sales: salesMap[week] || 0,
            Purchase: purchaseMap[week] || 0,
        })).filter(d => d.Sales > 0 || d.Purchase > 0);

        res.json(chartData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;