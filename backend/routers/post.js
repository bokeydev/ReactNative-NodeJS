const { createPost } = require("../controllers/post");

const router = require("express").Router();

router.post("/create", createPost);

module.exports = router;
