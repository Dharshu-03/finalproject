import express from "express";
import auth from "../middleware/auth.js";
import Invoice from "../models/Invoice.js";

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

export default router;