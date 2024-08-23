const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db");

router.get("/getChatId/:id", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const otherPersonId = req.params.id;
  if (userId == otherPersonId) {
    res.json({ chatId: -1 });
  } else {
    db.query(
      `SELECT * FROM chat WHERE (user_1 = ? AND user_2 = ?) OR (user_1 = ? AND user_2 = ?)`,
      [userId, otherPersonId, otherPersonId, userId],
      (err, result) => {
        if (err) console.log(err.message);
        if (result.length > 0) {
          res.json({ chatId: result[0].chat_id });
        } else {
          const query = `INSERT IGNORE INTO chat (user_1, user_2) VALUES (?, ?)`;
          db.query(query, [userId, otherPersonId], (err, result) => {
            if (err) console.log(err.message);
            res.json({ chatId: result.insertId });
          });
        }
      }
    );
  }
});

router.get("/chatList", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const query = `SELECT 
                chat.chat_id,
                profile1.profile_id as user_1,
                profile1.display_name as disp1,
                profile1.profile_picture as pic1,
                profile2.profile_id as user_2,
                profile2.display_name as disp2,
                profile2.profile_picture as pic2,
                user1.username as username1,
                user2.username as username2
                FROM chat 
                INNER JOIN profile AS profile1 ON chat.user_1 = profile1.profile_id
                INNER JOIN profile AS profile2 ON chat.user_2 = profile2.profile_id
                INNER JOIN user AS user1 ON user1.user_id = chat.user_1
                INNER JOIN user AS user2 ON user2.user_id = chat.user_2
                WHERE user_1 = ? OR user_2 = ?`;
  db.query(query, [userId, userId], (err, result) => {
    if (err) console.log(err.message);
    res.json(result);
  });
});

router.get("/:chatId", authMiddleware, (req, res) => {
  const chatId = req.params.chatId;
  const query = `SELECT * FROM message WHERE chat_id = ?`;
  db.query(query, [chatId], (err, result) => {
    if (err) console.log(err.message);
    res.json(result);
  });
});

router.get("/getChatInfo/:chatId", authMiddleware, (req, res) => {
  const chatId = req.params.chatId;
  const query = `SELECT 
                  user1.profile_id as user_1,
                  user1.display_name as disp1,
                  user2.profile_id as user_2,
                  user2.display_name as disp2
                FROM chat 
                INNER JOIN profile AS user1 ON chat.user_1 = user1.profile_id
                INNER JOIN profile AS user2 ON chat.user_2 = user2.profile_id
                WHERE chat_id = ?`;
  db.query(query, [chatId], (err, result) => {
    if (err) console.log(err.message);
    res.json(result[0]);
  });
});

module.exports = router;
