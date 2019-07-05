"use strict";

const Tp = require('thingpedia');
const https = require('https');

var options_retrieve = {
  protocol: 'https:',
  hostname: 'almond-cardiology.herokuapp.com',
  path: '/retrieve?', // Query parameters are added later during function call
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
};

// TODO: This is test data (will be changed later)
const doctor_email = "rickygv@stanford.edu";
const doctor_password = "test";

module.exports = class Cardiology_Doctor extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology_doctor-" + this.state.userId;
    this.name = "Cardiology_Doctor Account for " + this.state.screenName;
    this.description = "This is your Cardiology Doctor Account. You can use it"
      + " to remind patients to track their blood pressure regularly.";

    this._doctor_email = "rickygv@stanford.edu";
    this._doctor_password = "test";
  }

  /*
   * Retrieves the patient's blood pressure measurements from the databse
   */
  get_measurements({ email }) {
    options_retrieve.path = '/retrieve?email=' + email + '&doctor_email=' + doctor_email + '&doctor_password=' + doctor_password;

    https.get(options_retrieve, res => {
      res.on('data', d => {
        console.log('Successfully retrieved measurements from database');
        return JSON.parse(d.toString());
      });
    }).on('error', error => {
      console.error(error);
    });
  }
};
