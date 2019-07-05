var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// WARNING: Need to change admin account's password before production.
// This is important since password is on GitHub in a public repo.
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:cardiology@cardiology-rsnpi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

router.post('/upload', (req, res) => {
  let doctor_email = req.body.doctor_email;
  let doctor_password = req.body.doctor_password;
  let email = req.body.email;
  let time = req.body.time;
  let measurement = req.body.measurement;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  console.log('Uploading data for patient: ' + email);

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }
    const patients = client.db("cardiology").collection("patients");
    const users = client.db("cardiology").collection("users");

    patients.findOne({ email: email }, (err, patient) => {
      if (patient) {
        if (doctor_email !== patient.doctor) {
          return res.status(400).json({ error: "You don't have access to this patient's measurements" });
        }

        bcrypt.hash(doctor_password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({ error: 'Error while hashing the password' });
          }

          users.findOne({ email: doctor_email, hash: hash }, (err, user) => {
            if (!user) {
              return res.status(400).json({ error: "User with these credentials doesn't exist" });
            }

            patients.update(
              { "_id" : patient._id  },
              { "$addToSet" : { "measurements" : { "time": time, "measurement": measurement } } }
            );

            res.sendStatus(200);
          });
        });
      } else {
        bcrypt.hash(doctor_password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({ error: 'Error while hashing the password' });
          }

          users.findOne({ email: doctor_email, hash: hash }, (err, user) => {
            if (!user) {
              return res.status(400).json({ error: "User with these credentials doesn't exist" });
            }

            patients.insertOne({
              email: email,
              doctor: doctor_email,
              measurements: {
                time: time,
                measurement: measurement
              }
            });

            res.sendStatus(200);
          });
        });
      }
    });
  });
})

router.get('/retrieve', (req, res) => {
  let doctor_email = req.query.doctor_email;
  let doctor_password = req.query.doctor_password;
  let email = req.query.email;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  console.log('Retrieving measurements from: ' + email);

  client.connect(err => {
    if (err) {
      return res.status(500).json({ error: 'Error connecting to the MongoDB database' });
    }
    const patients = client.db("cardiology").collection("patients");
    const users = client.db("cardiology").collection("users");

    patients.findOne({ email: email }, (err, patient) => {
      if (!patient) {
        return res.status(400).json({ error: "There doesn't exist a patient with this email" });
      }

      if (doctor_email !== patient.doctor) {
        return res.status(400).json({ error: "You don't have access to this patient's measurements" });
      }

      bcrypt.hash(doctor_password, 10, function (err, hash) {
        if (err) {
          return res.status(500).json({ error: 'Error while hashing the password' });
        }

        users.findOne({ email: doctor_email, hash: hash }, (err, user) => {
          if (!user) {
            return res.status(400).json({ error: "User with these credentials doesn't exist" });
          }

          return res.status(200).json({ measurements: patient.measurements });
        });
      });
    });
  });
})

module.exports = router;
