const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ email, password: hashed });

        res.json({ msg: "User created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Login

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // 2. Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        // 4. Send response
        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Email not registered" });
        }

        // You can later add OTP logic here
        res.json({ msg: "Email verified" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        // hash new password
        const hashed = await bcrypt.hash(password, 10);

        user.password = hashed;
        await user.save();

        res.json({ msg: "Password updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};