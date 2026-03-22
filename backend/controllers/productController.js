import Product from "../models/Product.js";
import fs from "fs";
import csv from "csv-parser";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

export default upload;

// ✅ Add single product
export const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const uploadCSV = (req, res) => {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    if (req.file) {
        console.log("PATH:", req.file.path);
    }
    const results = [];



    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => {
            console.log("RAW ROW:", data);
            results.push({
                name: data.name,
                productId: data.productId,
                category: data.category,
                price: Number(data.price),
                quantity: Number(data.quantity),
                unit: data.unit,
                expiryDate: new Date(data.expiryDate),
                threshold: Number(data.threshold)
            });
        })
        .on("error", (err) => {
            res.status(500).json({ error: "CSV parse error: " + err.message });
        })
        .on("end", async () => {

            try {
                console.log("Parsed rows:", results); // 👈 add this to verify data
                if (results.length === 0) {
                    return res.status(400).json({ error: "CSV is empty or couldn't be parsed" });
                }
                await Product.insertMany(results, { ordered: false });
                fs.unlinkSync(req.file.path);
                res.json({ message: `${results.length} products uploaded successfully` });
            } catch (err) {
                console.error("insertMany error:", err); // 👈 log full error
                res.status(500).json({ error: err.message });
            }

        });
};