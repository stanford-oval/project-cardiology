"use strict";

const Tp = require('thingpedia');

module.exports = class Cardiology_Doctor extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology_doctor-" + this.state.userId;
    this.name = "Cardiology_Doctor Account for " + this.state.screenName;
    this.description = "This is your Cardiology Doctor Account. You can use it"
      + " to remind patients to track their blood pressure regularly.";

    // TODO: This is test data (will be changed later)
    this._doctor_email = "rickygv@stanford.edu";
    this._doctor_password = "test";
  }

  /*
   * Retrieves the patient's blood pressure measurements from the databse
   */
  get_measurements({ email }) {
    let path = '/retrieve?email=' + email + '&doctor_email=' + this._doctor_email + '&doctor_password=' + this._doctor_password;

    return Tp.Helpers.Http.get("https://almond-cardiology.herokuapp.com" + path).then((result) => {
      return JSON.parse(result.toString());
    }).then((measurements) => {
      console.log('Successfully retrieved measurements from database');
      return measurements;
    });
  }
};
