const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");

const bcrypt = require("bcrypt");

const saltRounds = 10;

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const displayName = req.body.displayName;

  usernameExists = false;
  emailExists = false;

  db.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (err, result) => {
      if (result.length > 0) {
        usernameExists = true;
      }
      db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
        if (result.length > 0) {
          emailExists = true;
        }
        if (usernameExists && emailExists)
          res
            .status(400)
            .send({ message: "Username and email already exists" });
        else if (usernameExists)
          res.status(400).send({ message: "Username already exists" });
        else if (emailExists)
          res.status(400).send({ message: "Email already exists" });
        else {
          bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
              console.log(err);
            }
            db.query(
              "INSERT INTO user (username, email, password) VALUES (?,?,?)",
              [username, email, hash],
              (err, result) => {
                jwt.sign(
                  {
                    username: username,
                    email: email,
                    displayName: displayName,
                    id: result.insertId,
                  },
                  "secretkey",
                  (err, token) => {
                    res.json({
                      token: token,
                      user: {
                        username: username,
                        email: email,
                        displayName: displayName,
                        id: result.insertId,
                      },
                    });
                  }
                );
                db.query(
                  "INSERT INTO profile (profile_id, display_name) VALUES (?,?)",
                  [result.insertId, displayName],
                  (err, result) => {
                    if (err) console.log(err);
                  }
                );
              }
            );
          });
        }
      });
    }
  );
});

router.post("/login", (req, res) => {
  const email_username = req.body.email_username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user WHERE (email = ? OR username = ?) LIMIT 1;",
    [email_username, email_username],
    (err, result) => {
      if (err) {
        res.status(400).send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            jwt.sign(
              {
                username: result[0].username,
                email: result[0].email,
                displayName: result[0].displayName,
                id: result[0].user_id,
              },
              "secretkey",
              (err, token) => {
                res.json({
                  token: token,
                  user: {
                    username: result[0].username,
                    email: result[0].email,
                    displayName: result[0].displayName,
                    id: result[0].user_id,
                  },
                });
              }
            );
          } else {
            res.status(400).send({ message: "Wrong password" });
          }
        });
      } else {
        res.status(400).send({ message: "Wrong email/username" });
      }
    }
  );
});

module.exports = router;
