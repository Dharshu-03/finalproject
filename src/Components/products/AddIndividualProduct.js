import React, { useState } from "react";
import Nav from "../Navbar";
import "./addProduct.css";
import API from "../../api";

const AddIndividualProduct = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [productId, setProductId] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [threshold, setThreshold] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setImageFile(e.target.files[0]); // ✅ store actual file
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("productId", productId);
            formData.append("category", category);
            formData.append("price", Number(price));
            formData.append("quantity", Number(quantity));
            formData.append("unit", unit);
            formData.append("expiryDate", expiryDate);
            formData.append("threshold", Number(threshold));
            if (imageFile) formData.append("image", imageFile); // ✅ attach image

            await API.post("/api/products/add", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Product added successfully");
            setName("");
            setProductId("");
            setCategory("");
            setPrice("");
            setQuantity("");
            setUnit("");
            setExpiryDate("");
            setThreshold("");
            setImage(null);
            setImageFile(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add product");
        }
    };

    return (
        <div className="add-product-page">
            <Nav />

            <div className="indcontent">
                <h2>Product</h2>
                <hr />
                <p className="breadcrumb">Add Product &gt; Individual Product</p>

                <div className="form-container">
                    <h3>New Product</h3>
                    <form action="" onSubmit={handleSubmit}>
                        {/* Image Upload */}
                        <div className="image-upload">
                            <div className="image-box">
                                {image ? (
                                    <img src={image} alt="preview" />
                                ) : (
                                    <span></span>
                                )}
                            </div>

                            <div>
                                <p>Drag image here</p>
                                <p>or</p>
                                <label className="browse-link">
                                    Browse image
                                    <input type="file" hidden onChange={handleImage} />
                                </label>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="form">
                            <label>Product Name</label>
                            <input
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <label>Product ID</label>
                            <input
                                placeholder="Enter product ID"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />

                            <label>Category</label>
                            <input
                                placeholder="Select product category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />

                            <label>Price</label>
                            <input
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />

                            <label>Quantity</label>
                            <input
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />

                            <label>Unit</label>
                            <input
                                placeholder="Enter unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />

                            <label>Expiry Date</label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />

                            <label>Threshold Value</label>
                            <input
                                placeholder="Enter threshold value"
                                value={threshold}
                                onChange={(e) => setThreshold(e.target.value)}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button className="discard">Discard</button>
                            <button className="submit" type="submit" >Add Product</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddIndividualProduct;