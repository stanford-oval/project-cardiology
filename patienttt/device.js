"use strict";

const Tp = require('thingpedia');

module.exports = class Cardiology_Patient extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology_patient-" + this.state.userId;
    this.name = "Cardiology_Patient Account for " + this.state.screenName;
    this.description = "This is your Cardiology Patient Account. You can use it"
      + " to upload your blood pressure recordings for your doctor.";
  }

  /*
   * Allows the patient to upload their blood pressure measurements for their doctor
   */
  do_record({ measurement }) {
  }
};
