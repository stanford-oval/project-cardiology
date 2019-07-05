"use strict";

const Tp = require('thingpedia');

module.exports = class Cardiology_Doctor extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology_doctor-" + this.state.userId;
    this.name = "Cardiology_Doctor Account for " + this.state.screenName;
    this.description = "This is your Cardiology Doctor Account. You can use it"
      + " to remind patients to track their blood pressure regularly.";
  }

  /*
   * Sign up for a cardiology acccount
   */
  do_signup({ email, password }) {
    // TODO: Signup code here
  }

  /*
   * Get the patient's measurements
   */
  get_measurements({ email, password, patient_email }) {
    let measurements = null;
    return [{ measurements: measurements }];
  }
};
