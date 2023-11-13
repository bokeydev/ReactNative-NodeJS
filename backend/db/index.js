const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/fs-blog")
  .then(() => console.log("db connected"))
  .catch((err) => console.log("connection fail:", err.message || err));
