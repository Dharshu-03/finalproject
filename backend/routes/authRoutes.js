const router = require("express").Router();
const {
    signup,
    login,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

module.exports = router;