"use strict";

const Tp = require('thingpedia');
const TT = require('thingtalk');
const uuid = require('uuid');
const crypto = require('crypto');

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
    let data = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    });

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/signup", data, options)
    .catch(err => {
      console.error(err);
    });
  }

  async do_remind({}, env) {
    const systolic = await env.askQuestion(TT.Type.Measure('kPa'), "What is your systolic blood pressure reading?");
    const diastolic = await env.askQuestion(TT.Type.Measure('kPa'), "What is your diastolic blood pressure reading?");
    this.do_record({ systolic, diastolic });
  }

  /*
   * Uploads the patient's blood pressure measurements to the database
   */
  do_record({ systolic, diastolic }) {
    let data = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      doctor_username: this.state.username_of_the_doctor_you_would_like_to_receive_your_measurements,
      time: new Date(),
      systolic: systolic,
      diastolic: diastolic
    });

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/upload", data, options)
    .catch(err => {
      console.error(err);
    });
  }
};
