const {
  createPost,
  deletePost,
  updatePost,
  getPost,
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

router.put(
  "/:postId",
  multer.single("thumbnail"),
  parseData,
  postValidator,
  validate,
  updatePost
);

router.delete("/:postId", deletePost);
router.get("/single/:postId", getPost);
module.exports = router;
