const express = require("express");

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

const server = express();
server.use(express.json());

server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path} at ${new Date().toString()}`);
  next();
}

server.use(logger);

//custom middleware
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
