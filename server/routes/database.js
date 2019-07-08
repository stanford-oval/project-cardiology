var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// WARNING: Need to change admin account's password before production.
// This is important since password is on GitHub in a public repo.
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:cardiology@cardiology-rsnpi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

router.post('/upload', (req, res) => {
  let doctor_username = req.body.doctor_username;
  let username = req.body.username;
  let password = req.body.password;
  let time = req.body.time;
  let measurement = req.body.measurement;

  if (username === null || username.length < 1) {
    return res.status(400).json({ error: 'Username not found' });
  }

  console.log('Uploading data for patient: ' + username);

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }

    const patients = client.db("cardiology").collection("patients");
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

        patients.findOne({ username: username }, (err, patient) => {
          if (patient) {
            patients.update(
              { "_id" : patient._id  },
              { "$addToSet" : { "measurements" : { "time": time, "measurement": measurement } } }
            );

            res.sendStatus(200);
          } else {
            patients.insertOne({
              username: username,
              doctor: doctor_username,
              measurements: [{
                time: time,
                measurement: measurement
              }]
            });

            res.sendStatus(200);
          }
        });
      });
    });
  });
})

router.get('/retrieve', (req, res) => {
  let doctor_username = req.query.doctor_username;
  let doctor_password = req.query.doctor_password;
  let username = req.query.username;

  if (username === null || username.length < 1) {
    return res.status(400).json({ error: 'Username not found' });
  }

  console.log('Retrieving measurements from: ' + username);

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

        patients.findOne({ username: username }, (err, patient) => {
          if (!patient) {
            return res.status(400).json({ error: "There doesn't exist a patient with this username" });
          }

          if (doctor_username !== patient.doctor) {
            return res.status(400).json({ error: "You don't have access to this patient's measurements" });
          }

          return res.status(200).json(patient.measurements);
        });
      });
    });
  });
})

module.exports = router;
