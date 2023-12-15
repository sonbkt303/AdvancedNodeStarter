const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
// const cache = require("../cache");
const Blog = mongoose.model("Blog");
const { clearHash } = require("../services/cache");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id }).cache({ key: req.user.id });
    // const query = Blog.find();
    // query.limit(20).where({ id: 1});
    // query.setOptions({ maxTimeMS: 2570 });

    // const a = await query.getOptions();
    // // console.log(cache)
    // // console.log(query.getOptions());
    // console.log(a);

    // const data = await cache.get("hi");

    res.send(blogs);
  });

  app.post("/api/blogs", requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }

    clearHash(req.user.id);
  });
};
