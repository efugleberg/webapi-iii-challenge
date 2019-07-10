const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const { name } = req.body;
  Users.insert({ name })
    .then(response => {
      res.status(201).json({ name });
    })
    .catch(error => {
      res.status(500).json({ error: "error adding user to database" });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;
  const postData = { ...req.body, user_id: req.params.id };
  console.log("user_id", id, "   req.body   ", req.body);
  Posts.insert(postData)
    .then(response => {
      res.status(201).json({ text, id });
    })
    .catch(error => {
      res.status(500).json({ error: "error saving post to database" });
    });
});

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
        .json({ error: "the user information could not be retrieved" });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "the post information could not be retrieved" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
    const { id } = req.params;
    Users.remove(id)
    .then(deleted => {
        res.status(204).end()
    })
    .catch(error => {
        res.status(500).json({ message: 'error removing user' })
    })
});

router.put("/:id", validateUserId, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    Users.update(id, { name })
    .then(response => {
        res.status(200).json({ name })
    })
    .catch(error => {
        res.status(500).json({ error: 'error updating user' })
    })
});

//custom middleware
// Grabs user id from array, the length is not equal to 0, set user id to parameter, and move to next operation, otherwise throw error
function validateUserId(req, res, next) {
    console.log('req.user', req.user);
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

// If there is no key in req.body object, send error. If the key doesn't === name in the body, send error. If all is well, post user.
function validateUser(req, res, next) {
  console.log(req.body);
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
