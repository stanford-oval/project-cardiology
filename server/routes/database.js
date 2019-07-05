var express = require('express');
var router = express.Router();

// WARNING: Need to change admin account's password before production.
// This is important since password is on GitHub in a public repo.
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:cardiology@cardiology-rsnpi.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

router.post('/upload', (req, res) => {
  let email = req.body.email;
  let time = req.body.time;
  let measurement = req.body.measurement;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  console.log('Uploading data for patient: ' + email);

  client.connect(err => {
    const patients = client.db("cardiology").collection("patients");

    patients.findOne({ email: email }, (err, patient) => {
      if (patient) {
        if (patient.doctor !== req.session.user) {
          return res.status(400).json({ error: "You do not have access to this patient's measurements" });
        }

        patients.update(
          { "_id" : patient._id  },
          { "$addToSet" : { "measurements" : { "time": time, "measurement": measurement } } }
        );

        res.sendStatus(200);
      } else {
        patients.insertOne({
          doctor: req.session.user,
          measurements: {
            time: time,
            measurement: measurement
          }
        });

        res.sendStatus(200);
      }
    });
  });
})

router.get('/retrieve', (req, res) => {
  let email = req.query.email;

  if (email === null || email.length < 1) {
    return res.status(400).json({ error: 'Email not found' });
  }
  console.log('Retrieving measurements from: ' + email);

  client.connect(err => {
    const patients = client.db("cardiology").collection("patients");

    patients.findOne({ email: email }, (err, patient) => {
      if (!patient) {
        return res.status(400).json({ error: "There doesn't exist a patient with this email" });
      }

      if (patient.doctor !== req.session.user) {
        return res.status(400).json({ error: "You do not have access to this patient's measurements" });
      }

      return res.status(200).json({ measurements: patient.measurements });
    });
  });
})

module.exports = router;
