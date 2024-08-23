const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

router.post("/post/personal/:postId", authMiddleware, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const like = req.body.like; // true or false
  console.log("IN LIKE");
  if (like) {
    console.log("LIKE");
    db.query(
      `INSERT IGNORE INTO likes (post_id, user_id) VALUES (?, ?)`,
      [postId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Liked Personal Post" });
      }
    );
  } else {
    console.log("UNLIKE");
    db.query(
      `DELETE FROM likes WHERE post_id = ? AND user_id = ?`,
      [postId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unliked Personal Post" });
      }
    );
  }
});

router.post("/reply/personal/:replyId", authMiddleware, (req, res) => {
  const replyId = req.params.replyId;
  const userId = req.user.id;
  const like = req.body.like; // true or false
  if (like) {
    db.query(
      `INSERT IGNORE INTO replies_likes (reply_id, user_id) VALUES (?, ?)`,
      [replyId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Liked personal reply" });
      }
    );
  } else {
    db.query(
      `DELETE FROM replies_likes WHERE reply_id = ? AND user_id = ?`,
      [replyId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unliked personal reply" });
      }
    );
  }
});

router.post("/post/interests/:postId", authMiddleware, (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const like = req.body.like; // true or false
  console.log("IN LIKE");
  if (like) {
    console.log("LIKE");
    db.query(
      `INSERT IGNORE INTO interest_likes (post_id, user_id) VALUES (?, ?)`,
      [postId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Liked Interest Post" });
      }
    );
  } else {
    console.log("UNLIKE");
    db.query(
      `DELETE FROM interest_likes WHERE post_id = ? AND user_id = ?`,
      [postId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unliked Interest Post" });
      }
    );
  }
});

router.post("/reply/interests/:replyId", authMiddleware, (req, res) => {
  const replyId = req.params.replyId;
  const userId = req.user.id;
  const like = req.body.like; // true or false
  if (like) {
    db.query(
      `INSERT IGNORE INTO interest_replies_likes (reply_id, user_id) VALUES (?, ?)`,
      [replyId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Liked interest reply" });
      }
    );
  } else {
    db.query(
      `DELETE FROM interest_replies_likes WHERE reply_id = ? AND user_id = ?`,
      [replyId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unliked interest reply" });
      }
    );
  }
});

module.exports = router;
