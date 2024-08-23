const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db");

router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { pageNumber, search } = req.query;
  const pageSize = 10;
  const offset = (pageNumber - 1) * pageSize;
  const searchLike = "%" + search + "%";
  query = `SELECT *
  FROM user
  INNER JOIN profile ON user.user_id = profile.profile_id
  WHERE (profile.display_name LIKE ? or user.username like ?) and user.user_id != ?
  limit 10 offset ?`;
  db.query(query, [searchLike, searchLike, userId, offset], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
