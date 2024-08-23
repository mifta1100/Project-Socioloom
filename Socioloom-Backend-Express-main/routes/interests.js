const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db");

router.post("/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const subscribe = req.body.subscribe; // true or false
  if (subscribe) {
    db.query(
      `INSERT IGNORE INTO subscribed_interest VALUES(?,?)`,
      [userId, id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Subscribed Interest" });
      }
    );
  } else {
    db.query(
      `DELETE FROM subscribed_interest WHERE user_id = ? AND interest_id = ?`,
      [userId, id],
      (err, result) => {
        if (err) console.log(err.message);
        res.json({ message: "Unubscribed Interest" });
      }
    );
  }
});

router.get("/", authMiddleware, (req, res) => {
  db.query(`SELECT * FROM interest`, (err, result) => {
    if (err) console.log(err.message);
    res.json(result);
  });
});

router.get("/user", authMiddleware, (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT 
      i.interest_id,
      i.title,
      CASE WHEN si.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS subscribed
    FROM interest i
    LEFT JOIN subscribed_interest si ON i.interest_id = si.interest_id AND si.user_id = ?;`,
    [userId],
    (err, result) => {
      if (err) console.log(err.message);
      res.json(result);
    }
  );
});

module.exports = router;
