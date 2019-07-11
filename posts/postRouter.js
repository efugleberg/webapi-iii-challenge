const express = require("express");

const Posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "error retrieving posts" });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({ error: "error getting post" });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then(deleted => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(500).json({ error: "mixup deleting post, please try again " });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  Posts.update(id, { text })
    .then(response => {
      res.status(200).json({ text });
    })
    .catch(error => {
      res.status(500).json({ error: "error updating post" });
    });
});

// custom middleware
//  Get post by ID.  Then if the post exists and the object has keys, move along.
//  Otherwise, post ID doesn't exist.
function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(post => {
      if (Object.keys(post).length > 0) {
        console.log("object keys", Object.keys(post).length);
        next();
      }
    })
    .catch(error => {
      res.status(400).json({ message: "invalid post ID" });
    });
}

module.exports = router;
