const router = require("express").Router();
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getUser,
    updateProfile
} = require("../controllers/authController");
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.put("/update", updateProfile);
router.get("/user/:email", getUser);
module.exports = router;