require("./db");
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const postRouter = require("./routers/post");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/post", postRouter);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("port is listening on" + PORT);
});
