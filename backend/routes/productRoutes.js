import express from "express";
import multer from "multer";
import { addProduct, uploadCSV } from "../controllers/productController.js";
// router.js
import upload from "../controllers/productController.js"; // use the controller's multer



const router = express.Router();

// multer config
const upload = multer({ dest: "uploads/" });

// single product
router.post("/add", addProduct);

// csv upload
router.post("/upload-csv", upload.single("file"), uploadCSV);

export default router;