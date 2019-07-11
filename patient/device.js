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

    this._email = '';
    this._key = '';
  }

  do_configure_patient({ email, key }) {
    this._email = email;
    this._key = key;

    /* Stores the patient's credentials in our database */
    let data = JSON.stringify({
      username: email,
      password: key
    });

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/signup", data, options)
    .catch(err => {
      console.error(err);
    });
  }

  async do_remind({}, env) {
    const systolic = await env.askQuestion(TT.Type.Measure('mmHg'), "What is your systolic blood pressure reading?");
    const diastolic = await env.askQuestion(TT.Type.Measure('mmHg'), "What is your diastolic blood pressure reading?");
    this.do_record({ systolic, diastolic });
  }

  /*
   * Uploads the patient's blood pressure measurements to the database
   */
  do_record({ systolic, diastolic }) {
    let data = JSON.stringify({
      username: this.state.email,
      password: this.state.key,
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
