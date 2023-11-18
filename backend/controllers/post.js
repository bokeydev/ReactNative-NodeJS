const Post = require("../models/post");
const FeaturedPost = require("../models/featuredPost");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const FEATURED_POST_COUNT = 4;

const addToFeaturedPost = async (postId) => {
  const alreadyExists = await FeaturedPost.findOne({ post: postId });
  if (alreadyExists) return;

  const featuredPost = new FeaturedPost({ post: postId });
  await featuredPost.save();

  const featuredPosts = await FeaturedPost.find({}).sort({ createdAt: -1 });
  featuredPosts.forEach(async (post, index) => {
    if (index >= FEATURED_POST_COUNT)
      await FeaturedPost.findByIdAndDelete(post._id);
  });
};

const removeFromFeaturedPost = async (postId) => {
  await FeaturedPost.findOneAndDelete({ post: postId });
};

const isFeaturedPost = async (postId) => {
  const post = await FeaturedPost.findOne({ post: postId });
  return post ? true : false;
};

exports.createPost = async (req, res) => {
  const { title, meta, content, slug, author, tags, featured } = req.body;
  const { file } = req;

  const alreadyExists = await Post.findOne({ slug });
  if (alreadyExists)
    return res.status(400).json({ error: "Please use unique slug" });

  const newPost = new Post({
    title,
    meta,
    content,
    slug,
    author,
    tags,
  });

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newPost.thumbnail = { url, public_id };
  }

  if (featured) await addToFeaturedPost(newPost._id);

  await newPost.save();

  res.json({
    post: {
      id: newPost._id,
      title,
      content,
      meta,
      slug,
      tags,
      thumbnail: newPost.thumbnail?.url,
      author: newPost.author,
    },
  });
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "Invalid request" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const public_id = post.thumbnail?.public_id;
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok")
      return res.status(404).josn({ error: "Could not remove thumbnail" });
  }

  await Post.findByIdAndDelete(postId);
  await removeFromFeaturedPost(postId);
  res.json({ message: "Post removed" });
};

exports.updatePost = async (req, res) => {
  const { title, meta, content, slug, author, tags, featured } = req.body;
  const { file } = req;

  const { postId } = req.params;
  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "Invalid request" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const public_id = post.thumbnail?.public_id;
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok")
      return res.status(404).josn({ error: "Could not remove thumbnail" });
  }

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    post.thumbnail = { url, public_id };
  }

  post.title = title;
  post.meta = meta;
  post.content = content;
  post.slug = slug;
  post.author = author;
  post.tags = tags;

  if (featured) await addToFeaturedPost(post._id);
  else await removeFromFeaturedPost(post._id);

  await post.save();

  res.json({
    post: {
      id: post._id,
      title,
      content,
      meta,
      slug,
      tags,
      thumbnail: post.thumbnail?.url,
      author: post.author,
      content,
      featured,
    },
  });
};

exports.getPost = async (req, res) => {
  const { slug } = req.params;
  if (!slug) return res.status(401).json({ error: "Invalid request" });

  const post = await Post.findOne({ slug });
  if (!post) return res.status(404).json({ error: "Post not found" });

  const featured = await isFeaturedPost(post._id);

  const { title, meta, content, author, tags, createdAt } = post;

  res.json({
    post: {
      id: post._id,
      title,
      content,
      meta,
      slug,
      tags,
      thumbnail: post.thumbnail?.url,
      author,
      featured,
      createdAt,
    },
  });
};

exports.getFeaturedPosts = async (req, res) => {
  const featuredPosts = await FeaturedPost.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("post");
  res.json({
    posts: featuredPosts.map(({ post }) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      meta: post.content,
      slug: post.slug,
      tags: post.tags,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
};

exports.getPosts = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      meta: post.content,
      slug: post.slug,
      tags: post.tags,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
};

exports.searchPost = async (req, res) => {
  const { title } = req.query;
  if (!title.trim())
    return res.status(401).json({ error: "search query missing" });

  const posts = await Post.find({ title: { $regex: title, $options: "i" } });
  res.json({
    posts: posts.map((post) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      meta: post.content,
      slug: post.slug,
      tags: post.tags,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
};

exports.getRelatedPosts = async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId))
    return res.status(401).json({ error: "Invalid request" });

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const relatedPosts = await Post.find({
    tags: { $in: [...post.tags] },
    _id: { $ne: post._id },
  })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    posts: relatedPosts.map((post) => ({
      id: post._id,
      title: post.title,
      content: post.content,
      meta: post.content,
      slug: post.slug,
      tags: post.tags,
      thumbnail: post.thumbnail?.url,
      author: post.author,
    })),
  });
};

exports.uploadImage = async (req, res) => {
  const { file } = req;
  if (!file) return res.status(401).json({ error: "image file is missing" });

  const { secure_url: url } = await cloudinary.uploader.upload(file.path);

  res.status(201).json({ image: url });
};
