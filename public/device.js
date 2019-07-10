"use strict";

const Tp = require('thingpedia');

module.exports = class Cardiology_Public extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.name = "Cardiology_Public";
    this.description = "Cardiology_Public. You should not access this skill."
                  + "It is only used internally, by the Cardiology project.";
  }

  do_configure_patient({ key }) {
    // TODO: database call to hash and upload the key
  }
};
