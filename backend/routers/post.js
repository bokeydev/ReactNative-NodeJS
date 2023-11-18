const {
  createPost,
  deletePost,
  updatePost,
  getPost,
  getFeaturedPosts,
  getPosts,
  searchPost,
  getRelatedPosts,
  uploadImage,
} = require("../controllers/post");
const multer = require("../middleware/multer");
const { postValidator, validate } = require("../middleware/postValidator");
const { parseData } = require("../middleware");
const router = require("express").Router();

router.post(
  "/create",
  multer.single("thumbnail"),
  parseData,
  postValidator,
  validate,
  createPost
);
router.post("/upload-image", multer.single("image"), uploadImage);

router.put(
  "/:postId",
  multer.single("thumbnail"),
  parseData,
  postValidator,
  validate,
  updatePost
);

router.delete("/:postId", deletePost);
router.get("/single/:slug", getPost);
router.get("/featured-posts", getFeaturedPosts);
router.get("/posts", getPosts);
router.get("/related-posts/:postId", getRelatedPosts);
router.get("/search", searchPost);

module.exports = router;
