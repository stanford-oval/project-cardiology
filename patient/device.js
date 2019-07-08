"use strict";

const Tp = require('thingpedia');
const TT = require('thingtalk');

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

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/signup", data, options).then(response => {
      if (!response.ok()) {
        response.json().then(json => {
          console.error(json.error);
        });
      }
    }).catch(err => {
      console.error(err);
    });
  }

  async do_remind({}, env) {
    const answer = await env.askQuestion(TT.Type.Measure('kPa'), "What is your blood pressure reading?");
    this.do_record({ answer });
  }

  /*
   * Uploads the patient's blood pressure measurements to the database
   */
  do_record({ measurement }) {
    let data = JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      doctor_username: this.state.username_of_the_doctor_you_would_like_to_receive_your_measurements,
      time: new Date(),
      measurement: measurement
    });

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/upload", data, options).then(response => {
      if (!response.ok()) {
        response.json().then(json => {
          console.error(json.error);
        });
      }
    }).catch(err => {
      console.error(err);
    });
  }
};