var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var connection = require('../database');

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

  connection.query(`SELECT * FROM users WHERE username = '${username}'`, function (err, result, fields) {
    if (err) {
      return res.status(500).json({ error: 'Error while retrieving data from users table' });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: 'Patient with this username does not exist' });
    }

    bcrypt.compare(password, result[0].hash, function (err, same_password) {
      if (err) {
        return res.status(500).json({ error: 'Error while hashing the password' });
      }
      if (!same_password) {
        return res.status(400).json({ error: 'The password is incorrect' });
      }

      connection.query(`INSERT INTO readings (username, time, systolic, diastolic) VALUES ('${username}', '${time}', '${systolic}', '${diastolic}')`, function (err, result) {
        if (err) {
          return res.status(500).json({ error: 'Error while inserting into table' });
        }
        res.sendStatus(200);
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

  connection.query(`SELECT * FROM users WHERE username = '${doctor_username}'`, function (err, result, fields) {
    if (err) {
      return res.status(500).json({ error: 'Error while retrieving data from users table' });
    }
    if (result.length === 0) {
      return res.status(400).json({ error: 'Doctor with this username does not exist' });
    }

    bcrypt.compare(doctor_password, result[0].hash, function (err, same_password) {
      if (err) {
        return res.status(500).json({ error: 'Error while hashing the password' });
      }
      if (!same_password) {
        return res.status(400).json({ error: 'The password is incorrect' });
      }

      connection.query(`SELECT * FROM readings WHERE username = '${username}'`, function (err, result) {
        if (err) {
          return res.status(500).json({ error: 'Error while retrieving data from readings table' });
        }
        res.status(200).json(result);
      });
    });
  });
})

module.exports = router;
