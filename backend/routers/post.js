const { createPost } = require("../controllers/post");
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

module.exports = router;
