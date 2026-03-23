import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { addProduct, uploadCSV } from "../controllers/productController.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/add", auth, addProduct);
router.post("/upload-csv", auth, upload.single("file"), uploadCSV);

router.get("/stats", auth, async (req, res) => {
    try {
        const allProducts = await Product.find({ userId: req.userId });
        const categories = new Set(allProducts.map(p => p.category)).size;
        const totalProducts = allProducts.length;
        const totalAmount = allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const topSelling = allProducts.filter(p => p.quantity <= p.threshold);
        const topSellingCount = topSelling.length;
        const topSellingAmount = topSelling.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const lowStock = allProducts.filter(p => p.quantity > 0 && p.quantity <= p.threshold);
        const lowStockCount = lowStock.length;
        const lowStockAmount = lowStock.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        res.json({ categories, totalProducts, totalAmount, topSellingCount, topSellingAmount, lowStockCount, lowStockAmount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments({ userId: req.userId });
        const products = await Product.find({ userId: req.userId })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        res.json({ products, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id/buy", auth, async (req, res) => {
    try {
        const { quantity } = req.body;

        const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
        if (!product) return res.status(404).json({ error: "Product not found" });
        if (quantity > product.quantity) return res.status(400).json({ error: "Not enough stock" });

        product.quantity -= quantity;
        await product.save();

        const invoiceId = "INV-" + Date.now();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const invoice = new Invoice({
            userId: req.userId,
            invoiceId,
            productName: product.name,
            productId: product._id,
            amount: product.price * quantity,
            quantity,
            status: "unpaid",
            dueDate,
        });
        await invoice.save();

        res.json({ message: "Purchase successful", invoice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/top-products", auth, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId })
            .sort({ quantity: 1 }) // least quantity = most sold/top selling
            .limit(6);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/add", auth, upload.single("image"), addProduct);

export default router;