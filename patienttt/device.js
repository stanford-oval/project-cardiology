"use strict";

const Tp = require('thingpedia');

let options = {
  dataContentType: "application/json"
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

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/upload", data, options).then(() => {
      console.log('Successfully uploaded measurement to database');
    });
  }
};
