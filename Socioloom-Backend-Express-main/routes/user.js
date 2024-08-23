const express = require("express");
const router = express.Router();
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

router.get("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  db.query(
    `SELECT *
    FROM user
    INNER JOIN profile ON user.user_id = profile.profile_id
    Where user.user_id = ?
    limit 1`,
    [id],
    (err, result) => {
      if (err) console.log(err.message);
      res.json({
        username: result[0].username,
        displayName: result[0].display_name,
        profilePicture: result[0].profile_picture,
        coverPicture: result[0].cover_picture,
        bio: result[0].bio,
      });
    }
  );
});

router.put("/", authMiddleware, upload.any(), (req, res) => {
  console.log(req.body);
  console.log(req.files.length);
  const displayName = req.body.displayName;
  const bio = req.body.bio;
  if (req.files.length == 0 && !displayName && !bio)
    res.status(400).send({ message: "No data" });
  else if (
    req.files.length > 1 &&
    req.files[0].fieldname === "profilePicture" &&
    req.files[1].fieldname === "coverPicture" &&
    displayName &&
    bio
  ) {
    console.log("3");
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        sharp(req.files[1].buffer)
          .jpeg(compressionOptions)
          .toBuffer((err, compressedBuffer, info) => {
            if (err) console.log(err.message);
            base64Image2 = compressedBuffer.toString("base64");
            console.log(info);
            db.query(
              "UPDATE profile SET display_name = ?, bio = ?, profile_picture = ?, cover_picture = ? WHERE profile_id = ?",
              [displayName, bio, base64Image, base64Image2, req.user.id],
              (err, result) => {
                if (err) console.log(err.message);
                res.json({
                  displayName: displayName,
                  bio: bio,
                  profilePicture: base64Image,
                  coverPicture: base64Image2,
                });
              }
            );
          });
      });
  } else if (
    req.files.length > 0 &&
    req.files[0].fieldname === "profilePicture" &&
    displayName &&
    bio
  ) {
    console.log("1");
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "UPDATE profile SET display_name = ?, bio = ?, profile_picture = ? WHERE profile_id = ?",
          [displayName, bio, base64Image, req.user.id],
          (err, result) => {
            if (err) console.log(err.message);
            res.json({
              displayName: displayName,
              bio: bio,
              profilePicture: base64Image,
            });
          }
        );
      });
  } else if (
    req.files.length > 0 &&
    req.files[0].fieldname === "coverPicture" &&
    displayName &&
    bio
  ) {
    console.log("2");
    sharp(req.files[0].buffer)
      .jpeg(compressionOptions)
      .toBuffer((err, compressedBuffer, info) => {
        if (err) console.log(err.message);
        base64Image = compressedBuffer.toString("base64");
        console.log(info);
        db.query(
          "UPDATE profile SET display_name = ?, bio = ?, cover_picture = ? WHERE profile_id = ?",
          [displayName, bio, base64Image, req.user.id],
          (err, result) => {
            if (err) console.log(err.message);
            res.json({
              displayName: displayName,
              bio: bio,
              coverPicture: base64Image,
            });
          }
        );
      });
  } else if (displayName && bio) {
    console.log("4");
    db.query(
      "UPDATE profile SET display_name = ?, bio = ? WHERE profile_id = ?",
      [displayName, bio, req.user.id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({
          displayName: displayName,
          bio: bio,
        });
      }
    );
  } else if (displayName) {
    console.log("5");
    db.query(
      "UPDATE profile SET display_name = ?, bio = '' WHERE profile_id = ?",
      [displayName, req.user.id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({
          displayName: displayName,
        });
      }
    );
  }
});

module.exports = router;
