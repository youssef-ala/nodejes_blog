const Post = require("../models/post");

const getHomePage = async (req, res) => {
  try {
    const locals = {
      title: "Nodejs blog",
      description: "simple blog created with nodejs and mongodb",
    };

    let perPage = 6;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getPost = async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "simple blog created with nodejs and mongodb",
    };

    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchPosts = async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "simple blog created with nodejs and mongodb",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", { data, locals });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAboutPage = (req, res) => {
  res.render("about");
};

module.exports = {
  getHomePage,
  getPost,
  searchPosts,
  getAboutPage
};