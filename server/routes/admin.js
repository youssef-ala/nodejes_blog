const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getLoginPage, loginUser, getDashboard, registerUser, addPost, getMethodAddPost } = require("../controller/adminController");


// Routes
router.get("/admin", getLoginPage);
router.post("/admin", loginUser);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/register", registerUser);
router.get('/add-post',authMiddleware, getMethodAddPost)
router.post('/add-post', authMiddleware, addPost)
module.exports = router;