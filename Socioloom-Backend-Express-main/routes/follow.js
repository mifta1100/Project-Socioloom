const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db");

router.post("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const follow = req.body.follow; // true or false
  if (follow) {
    db.query(
      `INSERT IGNORE INTO follow (follower_id, following_id) VALUES (?, ?)`,
      [userId, id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Followed User" });
      }
    );
  } else {
    db.query(
      `DELETE FROM follow WHERE follower_id = ? AND following_id = ?`,
      [userId, id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unfollowed User" });
      }
    );
  }
});

router.get("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  db.query(
    `SELECT * FROM follow WHERE follower_id = ? AND following_id = ?`,
    [userId, id],
    (err, result) => {
      if (err) console.log(err.message);
      if (result.length > 0) {
        res.json({ following: true });
      } else {
        res.json({ following: false });
      }
    }
  );
});

module.exports = router;
