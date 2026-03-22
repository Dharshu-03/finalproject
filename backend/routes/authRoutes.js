import express from "express";
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getUser,
    updateProfile
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.put("/update", updateProfile);
router.get("/user/:email", getUser);

export default router;