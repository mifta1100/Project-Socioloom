const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

router.get("/personal/:postid", authMiddleware, (req, res) => {
  const id = req.params.postid;
  console.log("Params: postid ", req.params.postid);
  console.log("userid ", req.user.id);
  db.query(
    `SELECT 
      replies.reply_id,
      replies.post_id,
      replies.user_id,
      replies.reply_text,
      replies.time_replied,
      user.username,
      profile.display_name,
      profile.profile_picture,
      COUNT(distinct replies_likes.like_id) AS like_count,
      COUNT(CASE WHEN replies_likes.user_id = ? THEN replies_likes.like_id END) > 0 AS user_liked
    FROM replies
    INNER JOIN user ON replies.user_id = user.user_id
    INNER JOIN profile ON replies.user_id = profile.profile_id
    LEFT JOIN replies_likes ON replies.reply_id = replies_likes.reply_id
    WHERE replies.post_id = ?
    GROUP BY replies.post_id,replies.reply_id
    ORDER BY replies.reply_id DESC
    LIMIT 10 offset 0`,
    [req.user.id, id],
    (err, result) => {
      if (err) console.log(err.message);
      res.json(result);
    }
  );
});

router.post("/personal/:postid", authMiddleware, (req, res) => {
  const id = req.params.postid;
  console.log("Params: postid ", req.params.postid);
  console.log(req.body);
  if (!id || !req.body.ReplyText) res.status(400).send({ message: "No data" });
  else {
    db.query(
      `insert into replies(post_id,user_id,reply_text) VALUES(?,?,?)`,
      [id, req.user.id, req.body.ReplyText],
      (err, result) => {
        if (err) console.log(err.message);
        res.json(result);
      }
    );
  }
});

router.get("/interests/:postid", authMiddleware, (req, res) => {
  const id = req.params.postid;
  console.log("Params: postid ", req.params.postid);
  console.log("userid ", req.user.id);
  db.query(
    `SELECT 
      interest_replies.reply_id,
      interest_replies.post_id,
      interest_replies.user_id,
      interest_replies.reply_text,
      interest_replies.time_replied,
      user.username,
      profile.display_name,
      profile.profile_picture,
      COUNT(distinct interest_replies_likes.like_id) AS like_count,
      COUNT(CASE WHEN interest_replies_likes.user_id = ? THEN interest_replies_likes.like_id END) > 0 AS user_liked
    FROM interest_replies
    INNER JOIN user ON interest_replies.user_id = user.user_id
    INNER JOIN profile ON interest_replies.user_id = profile.profile_id
    LEFT JOIN interest_replies_likes ON interest_replies.reply_id = interest_replies_likes.reply_id
    WHERE interest_replies.post_id = ?
    GROUP BY interest_replies.post_id,interest_replies.reply_id
    ORDER BY interest_replies.reply_id DESC
    LIMIT 10 offset 0`,
    [req.user.id, id],
    (err, result) => {
      if (err) console.log(err.message);
      res.json(result);
    }
  );
});

router.post("/interests/:postid", authMiddleware, (req, res) => {
  const id = req.params.postid;
  console.log("Params: postid ", req.params.postid);
  console.log(req.body);
  if (!id || !req.body.ReplyText) res.status(400).send({ message: "No data" });
  else {
    db.query(
      `insert into interest_replies(post_id,user_id,reply_text) VALUES(?,?,?)`,
      [id, req.user.id, req.body.ReplyText],
      (err, result) => {
        if (err) console.log(err.message);
        res.json(result);
      }
    );
  }
});

module.exports = router;
