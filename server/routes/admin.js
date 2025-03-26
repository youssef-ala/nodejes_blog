const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getLoginPage,
  loginUser,
  getDashboard,
  registerUser,
  addPost,
  getMethodAddPost,
  editPost,
  getEditPost,
  deletePost,
  Logout,
} = require("../controller/adminController");

// Routes
router.get("/admin", getLoginPage);
router.post("/admin", loginUser);
router.get("/dashboard", authMiddleware, getDashboard);
router.post("/register", registerUser);
router.get("/add-post", authMiddleware, getMethodAddPost);
router.post("/add-post", authMiddleware, addPost);
// Add this above your PUT route
router.get("/edit-post/:id", authMiddleware, getEditPost);
router.put("/edit-post/:id", authMiddleware, editPost);
router.delete('/delete-post/:id', authMiddleware,deletePost)

router.get('/logout',Logout)


module.exports = router;
