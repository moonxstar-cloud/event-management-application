const { Register, Login } = require("../Controllers/UserController");
const { ensureAuthenticated } = require("../Middleware/Auth");
const router = require("express").Router();

// User Registration Route
router.post("/register", Register);

// User Login Route
router.post("/login", Login);

// Protected Route Example
router.get("/protected-route", ensureAuthenticated, (req, res) => {
    res
        .status(200)
        .json({
            message: "You have access to this protected route",
            user: req.user,
        });
});

module.exports = router;