const Post = require("../models/post");

exports.createPost = async (req, res) => {
  const { title, meta, content, slug, author, tags } = req.body;
  const newPost = new Post({ title, meta, content, slug, author, tags });

  await newPost.save();

  res.json(newPost);
};
