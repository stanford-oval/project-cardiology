var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// WARNING: Need to change admin account's password before production.
// This is important since password is on GitHub in a public repo.
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:cardiology@cardiology-rsnpi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

router.post('/upload', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let time = new Date();
  let systolic = req.body.systolic;
  let diastolic = req.body.diastolic;

  if (username === null || username.length < 1) {
    return res.status(400).json({ error: 'Username not found' });
  }

  console.log('Uploading data for patient: ' + username);

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }

    const users = client.db("cardiology").collection("users");
    users.findOne({ username: username }, (err, user) => {
      if (!user) {
        return res.status(400).json({ error: "Patient with this username doesn't exist" });
      }

      bcrypt.compare(password, user.hash, function (err, same_password) {
        if (err) {
          return res.status(500).json({ error: 'Error while hashing the password' });
        }
        if (!same_password) {
          return res.status(400).json({ error: "The password is incorrect" });
        }

        const patients = client.db("cardiology").collection("patients");
        patients.insertOne({
          username: username,
          time: time,
          systolic: systolic,
          diastolic: diastolic
        });

        res.sendStatus(200);
      });
    });
  });
})

router.get('/retrieve', (req, res) => {
  let doctor_username = req.query.doctor_username;
  let doctor_password = req.query.doctor_password;

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }

    const patients = client.db("cardiology").collection("patients");
    const users = client.db("cardiology").collection("users");

    users.findOne({ username: doctor_username }, (err, user) => {
      if (!user) {
        return res.status(400).json({ error: "Doctor with this username doesn't exist" });
      }

      bcrypt.compare(doctor_password, user.hash, function (err, same_password) {
        if (err) {
          return res.status(500).json({ error: 'Error while hashing the password' });
        }
        if (!same_password) {
          return res.status(400).json({ error: "The password is incorrect" });
        }

        patients.find((err, patients) => {
          if (!patients) {
            return res.status(400).json({ error: "You don't have any patients yet" });
          }

          return res.status(200).json(patients);
        });
      });
    });
  });
})

module.exports = router;
