var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// WARNING: Need to change admin account's password before production.
// This is important since password is on GitHub in a public repo.
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:cardiology@cardiology-rsnpi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

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

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }
    const users = client.db("cardiology").collection("users");

    users.findOne({ username: username }, (err, user) => {
      if (user) {
        return res.status(400).json({ error: 'Username already in use' });
      } else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({ error: 'Error while hashing the password' });
          }

          users.insertOne({
            username: username,
            hash: hash
          });

          res.sendStatus(200);
        });
      }
    });
  });
})

module.exports = router;
