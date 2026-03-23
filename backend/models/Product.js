import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    productId: String,
    category: String,
    price: Number,
    quantity: Number,
    unit: String,
    expiryDate: Date,
    threshold: Number,
    image: { type: String, default: "" }, // ✅ add this
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Product", productSchema);