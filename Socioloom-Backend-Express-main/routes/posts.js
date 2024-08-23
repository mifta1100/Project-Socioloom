const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = require("../db");
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const sharp = require("sharp");

const compressionOptions = {
  quality: 80, // Set the quality (0 to 100)
  progressive: true, // Enable progressive rendering
  optimizeScans: true, // Optimize the scans in a progressive image
};

const upload = multer({ storage: multer.memoryStorage() });

router.post("/personal", authMiddleware, upload.any(), (req, res) => {
  console.log(req.user);
  console.log("params2: ", req.params);
  if (!req.body.PostText && req.files.length == 0)
    res.status(400).send({ message: "No post text or files" });
  else if (req.body.PostText && req.files.length > 0) {
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "INSERT INTO post (user_id, post_text, post_image) VALUES (?,?,?)",
          [req.user.id, req.body.PostText, base64Image],
          (err, result) => {
            if (err) console.log(err.message);
            res.json({
              postText: req.body.PostText,
              postImage: base64Image,
            });
          }
        );
      });
  } else if (req.body.PostText) {
    db.query(
      "INSERT INTO post (user_id, post_text) VALUES (?,?)",
      [req.user.id, req.body.PostText],
      (err, result) => {
        if (err) console.log(err);
        res.json({
          postText: req.body.PostText,
        });
      }
    );
  } else if (req.files.length > 0) {
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "INSERT INTO post (user_id, post_image) VALUES (?,?)",
          [req.user.id, base64Image],
          (err, result) => {
            if (err) console.log(err);
            res.json({
              postImage: base64Image,
            });
          }
        );
      });
  } else {
    console.log("Something went wrong");
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.get("/personal", authMiddleware, (req, res) => {
  const { pageNumber, search, explore } = req.query;
  const searchLike = search ? ` WHERE post.post_text LIKE '%${search}%'` : "";
  const followLike = !explore
    ? `Where post.user_id in (select distinct following_id from follow where follower_id = ${req.user.id}) or post.user_id = ${req.user.id}`
    : "";

  const pageSize = 10;
  const offset = (pageNumber - 1) * pageSize;
  console.log("HERE I AM");
  console.log(offset);
  query =
    `SELECT 
            post.post_id,
            post.post_text,
            post.post_image,
            post.user_id,
            post.time_posted,
            user.username,
            profile.display_name,
            profile.profile_picture,
            COUNT(distinct likes.like_id) AS like_count,
            COUNT(distinct replies.reply_id) AS reply_count,
            COUNT(CASE WHEN likes.user_id = ? THEN likes.like_id END) > 0 AS user_liked
          FROM post
          INNER JOIN user ON post.user_id = user.user_id
          INNER JOIN profile ON post.user_id = profile.profile_id
          LEFT JOIN likes ON post.post_id = likes.post_id
          LEFT JOIN replies ON post.post_id = replies.post_id` +
    searchLike +
    ` ` +
    followLike +
    ` GROUP BY post.post_id
          ORDER BY post.post_id DESC
          LIMIT 10 offset ?`;
  db.query(query, [req.user.id, offset], (err, result) => {
    if (err) console.log(err);
    res.json(result);
  });
});

router.get("/personal/user", authMiddleware, (req, res) => {
  const { pageNumber } = req.query;
  const { userId } = req.query;
  const pageSize = 10;
  const offset = (pageNumber - 1) * pageSize;
  console.log(offset);
  query = `SELECT 
            post.post_id,
            post.post_text,
            post.post_image,
            post.user_id,
            post.time_posted,
            user.username,
            profile.display_name,
            profile.profile_picture,
            COUNT(distinct likes.like_id) AS like_count,
            COUNT(distinct replies.reply_id) AS reply_count,
            COUNT(CASE WHEN likes.user_id = ? THEN likes.like_id END) > 0 AS user_liked
          FROM post
          INNER JOIN user ON post.user_id = user.user_id
          INNER JOIN profile ON post.user_id = profile.profile_id
          LEFT JOIN likes ON post.post_id = likes.post_id
          LEFT JOIN replies ON post.post_id = replies.post_id
          WHERE post.user_id = ?
          GROUP BY post.post_id
          ORDER BY post.post_id DESC
          LIMIT 10 offset ?`;
  db.query(query, [req.user.id, userId, offset], (err, result) => {
    if (err) console.log(err);
    res.json(result);
  });
});

router.get("/personal/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  query = `SELECT 
            post.post_id,
            post.post_text,
            post.post_image,
            post.user_id,
            post.time_posted,
            user.username,
            profile.display_name,
            profile.profile_picture,
            COUNT(distinct likes.like_id) AS like_count,
            COUNT(distinct replies.reply_id) AS reply_count,
            COUNT(CASE WHEN likes.user_id = ? THEN likes.like_id END) > 0 AS user_liked
          FROM post
          INNER JOIN user ON post.user_id = user.user_id
          INNER JOIN profile ON post.user_id = profile.profile_id
          LEFT JOIN likes ON post.post_id = likes.post_id
          LEFT JOIN replies ON post.post_id = replies.post_id
          WHERE post.post_id = ?
          GROUP BY post.post_id
          LIMIT 1`;
  db.query(query, [req.user.id, id], (err, result) => {
    if (err) console.log(err);
    if (result.length == 0) res.status(404).send({ message: "Post not found" });
    else res.send(result[0]);
  });
});

router.post("/interests", authMiddleware, upload.any(), (req, res) => {
  if (!req.body.PostText && req.files.length == 0)
    res.status(400).send({ message: "No post text or files" });
  else if (req.body.PostText && req.files.length > 0) {
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "INSERT INTO interest_post (user_id, post_text, post_image, interest_id) VALUES (?,?,?,?)",
          [req.user.id, req.body.PostText, base64Image, req.body.PostInterest],
          (err, result) => {
            if (err) console.log(err.message);
            res.json({
              postText: req.body.PostText,
              postImage: base64Image,
            });
          }
        );
      });
  } else if (req.body.PostText) {
    db.query(
      "INSERT INTO interest_post (user_id, post_text, interest_id) VALUES (?,?,?)",
      [req.user.id, req.body.PostText, req.body.PostInterest],
      (err, result) => {
        if (err) console.log(err);
        res.json({
          postText: req.body.PostText,
        });
      }
    );
  } else if (req.files.length > 0) {
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "INSERT INTO interest_post (user_id, post_image, interest_id) VALUES (?,?,?)",
          [req.user.id, base64Image, req.body.PostInterest],
          (err, result) => {
            if (err) console.log(err);
            res.json({
              postImage: base64Image,
            });
          }
        );
      });
  } else {
    console.log("Something went wrong");
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.get("/interests", authMiddleware, (req, res) => {
  const { pageNumber, search, explore } = req.query;
  const searchLike = search
    ? ` WHERE interest_post.post_text LIKE '%${search}%'`
    : "";
  const interestLike = !explore
    ? `Where interest_post.interest_id in (select distinct interest_id from subscribed_interest where user_id = ${req.user.id})`
    : "";
  const pageSize = 10;
  const offset = (pageNumber - 1) * pageSize;
  console.log(offset);
  query =
    `SELECT 
            interest_post.post_id,
            interest_post.post_text,
            interest_post.post_image,
            interest_post.user_id,
            interest_post.time_posted,
            interest.title,
            user.username,
            profile.display_name,
            profile.profile_picture,
            COUNT(distinct interest_likes.like_id) AS like_count,
            COUNT(distinct interest_replies.reply_id) AS reply_count,
            COUNT(CASE WHEN interest_likes.user_id = ? THEN interest_likes.like_id END) > 0 AS user_liked
          FROM interest_post
          INNER JOIN user ON interest_post.user_id = user.user_id
          INNER JOIN profile ON interest_post.user_id = profile.profile_id
          INNER JOIN interest ON interest.interest_id = interest_post.interest_id
          LEFT JOIN interest_likes ON interest_post.post_id = interest_likes.post_id
          LEFT JOIN interest_replies ON interest_post.post_id = interest_replies.post_id` +
    searchLike +
    ` ` +
    interestLike +
    ` GROUP BY interest_post.post_id
          ORDER BY interest_post.post_id DESC
          LIMIT 10 offset ?`;
  db.query(query, [req.user.id, offset], (err, result) => {
    if (err) console.log(err);
    res.json(result);
  });
});

router.get("/interests/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  query = `SELECT 
            interest_post.post_id,
            interest_post.post_text,
            interest_post.post_image,
            interest_post.user_id,
            interest_post.time_posted,
            interest.title,
            user.username,
            profile.display_name,
            profile.profile_picture,
            COUNT(distinct interest_likes.like_id) AS like_count,
            COUNT(distinct interest_replies.reply_id) AS reply_count,
            COUNT(CASE WHEN interest_likes.user_id = ? THEN interest_likes.like_id END) > 0 AS user_liked
          FROM interest_post
          INNER JOIN user ON interest_post.user_id = user.user_id
          INNER JOIN profile ON interest_post.user_id = profile.profile_id
          INNER JOIN interest ON interest.interest_id = interest_post.interest_id
          LEFT JOIN interest_likes ON interest_post.post_id = interest_likes.post_id
          LEFT JOIN interest_replies ON interest_post.post_id = interest_replies.post_id
          WHERE interest_post.post_id = ?
          GROUP BY interest_post.post_id
          LIMIT 1`;
  db.query(query, [req.user.id, id], (err, result) => {
    if (err) console.log(err);
    if (result.length == 0) res.status(404).send({ message: "Post not found" });
    else res.send(result[0]);
  });
});

module.exports = router;
