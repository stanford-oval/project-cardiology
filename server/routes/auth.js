var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var connection = require('../database');

router.post('/signup', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === null || username.length < 1) {
    return res.status(400).json({ error: 'Username not found' });
  }
  if (password === null || password.length < 1) {
    return res.status(400).json({ error: 'Password not found' });
  }
  console.log('Signing up: ' + username);

  connection.query(`SELECT * FROM users WHERE username = '${username}'`, function (err, result, fields) {
    if (err) {
      return res.status(500).json({ error: 'Error while retrieving data from table' });
    }
    if (result.length !== 0) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        return res.status(500).json({ error: 'Error while hashing the password' });
      }

      connection.query(`INSERT INTO users (username, hash) VALUES ('${username}', '${hash}')`, function (err, result) {
        if (err) {
          return res.status(500).json({ error: 'Error while inserting into table' });
        }
        res.sendStatus(200);
      });
    });
  });
})

module.exports = router;
