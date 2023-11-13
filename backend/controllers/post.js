const Post = require("../models/post");

exports.createPost = (req, res) => {
  const { title, meta, content, slug, author, tags } = req.body;
  const post = new Post({ title, meta, content, slug, author, tags });
};
