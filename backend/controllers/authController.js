import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup
export const signup = async (req, res) => {
    const { email, password, fname, lname } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User exists" });

        const hashed = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashed, fname, lname });

        res.json({ msg: "User created" });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Email not registered" });
        }

        res.json({ msg: "Email verified" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;

        await user.save();

        res.json({ msg: "Password updated successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Get User
export const getUser = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        res.json({
            email: user.email,
            fname: user.fname,
            lname: user.lname
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    const { email, password, fname, lname } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        user.fname = fname;
        user.lname = lname;

        if (password && password.trim() !== "") {
            const hashed = await bcrypt.hash(password, 10);
            user.password = hashed;
        }

        await user.save();

        res.json({ msg: "Profile updated successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};