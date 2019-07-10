const express = require("express");

const Users = require("./userDb.js");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: "Users could not be retrieved" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "the post information could not be retrieved" });
    });
});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware
// Grabs user id from array, the length is not equal to 0, set user id to parameter, and move to next operation, otherwise throw error
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user.length !== 0) {
        req.user = user;
        next();
      }
    })
    .catch(error => {
      res.status(400).json({ message: "invalid user id" });
    });
}

// If there is no key in req.body object, send error. If there is no name in the body, send error. If all is well, move on.
function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

// If there is no key in req.body object, send error. If there is no text in the body, send error. If all is well, move on.
function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
