import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    productId: String,
    category: String,
    price: Number,
    quantity: Number,
    unit: String,
    expiryDate: Date,
    threshold: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Product", productSchema);