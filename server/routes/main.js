const express = require("express");
const router = express.Router();
const {
  getHomePage,
  getPost,
  searchPosts,
  getAboutPage
} = require("../controller/mainController");

// Routes
router.get("", getHomePage);
router.get("/post/:id", getPost);
router.post("/search", searchPosts);
router.get("/about", getAboutPage);

module.exports = router;