import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoiceId: { type: String, unique: true },
    productName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Invoice", invoiceSchema);