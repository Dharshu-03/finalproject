const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/authRoutes.js"));


app.listen(5000, () => console.log("Server running on port 5000"));

