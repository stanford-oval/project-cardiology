"use strict";

const Tp = require('thingpedia');
const https = require('https');

var options_retrieve = {
  hostname: 'https://almond-cardiology.herokuapp.com',
  path: '/retrieve?', // Query parameters are added later during function call
  method: 'GET',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  }
};

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
    let measurements = null;
    options_retrieve.path = '/retrieve?email=' + email;

    https.get(options_retrieve, res => {
      res.on('data', d => {
        measurements = d;
        console.log('Successfully retrieved measurements from database');
      });

      res.on('end', () => {
        return measurements;
      })
    }).on('error', error => {
      console.error(error);
    });
  }
};
