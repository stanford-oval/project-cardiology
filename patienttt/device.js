"use strict";

const Tp = require('thingpedia');
const https = require('https');

const options_upload = {
  hostname: 'https://almond-cardiology.herokuapp.com',
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
};

module.exports = class Cardiology_Patient extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology_patient-" + this.state.userId;
    this.name = "Cardiology_Patient Account for " + this.state.screenName;
    this.description = "This is your Cardiology Patient Account. You can use it"
      + " to upload your blood pressure recordings for your doctor.";

    // TODO: This is test data (will be changed later)
    this._email = "rickygv@stanford.edu";
    this._password = "test";
    this._doctor_email = "rickygv@stanford.edu";
  }

  /*
   * Uploads the patient's blood pressure measurements to the database
   */
  do_record({ measurement }) {
    let data = JSON.stringify({
      email: this._email,
      password: this._password,
      doctor_email: this._doctor_email,
      time: new Date(),
      measurement: measurement
    });

    let req = https.request(options_upload, res => {
      console.log('Successfully uploaded measurement to database');
    });

    req.on('error', error => {
      console.error(error);
    })

    req.write(data);

    req.end();
  }
};
