"use strict";

const Tp = require('thingpedia');

let options = {
  dataContentType: "application/json"
};

module.exports = class Cardiology_Patient extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.name = "Cardiology_Patient Account for " + this.state.username;
    this.description = "This is your Cardiology Patient Account. You can use it"
      + " to upload your blood pressure recordings for your doctor.";

    /* Stores the patient's credentials in our database */
    let path = '/signup?username=' + this.state.username + '&password=' + this.state.password;
    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com" + path).then(response => {
      if (!response.ok()) {
        response.json().then(json => {
          console.err(json.error);
        });
      }
    }).catch(err => {
      console.err(err);
    });
  }

  /*
   * Uploads the patient's blood pressure measurements to the database
   */
  do_record({ measurement }) {
    let data = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      doctor_username: this.state.doctor_username,
      time: new Date(),
      measurement: measurement
    });

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/upload", data, options).then(() => {
      console.log('Successfully uploaded measurement to database');
    }).catch(err => {
      console.err(err);
    });
  }
};
