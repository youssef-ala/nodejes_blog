const Post = require("../models/post");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = "../views/layouts/admin";

// Admin Login Page
const getLoginPage = async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "This is the admin page",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Admin Login Check
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Admin Dashboard
const getDashboard = async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "this is the dashboard page",
    };
    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("this is the error", error);
  }
};

// Register New User
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User created", user });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "User already exists" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMethodAddPost = async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "this is the add post page",
    };
    const data = await Post.find();
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
};
const addPost = async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const getEditPost = async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "you can edit your post here",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render(`admin/edit-post`, {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
};

const editPost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

const Logout = (req,res) => {
  res.clearCookie("token");
  res.redirect('/')
}

module.exports = {
  getLoginPage,
  loginUser,
  getDashboard,
  registerUser,
  getMethodAddPost,
  addPost,
  getEditPost,
  editPost,
  deletePost,
  Logout,
};
