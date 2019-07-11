"use strict";

const Tp = require('thingpedia');

let options = {
  dataContentType: "application/json"
};

module.exports = class Cardiology_Public extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.name = "Cardiology_Public";
    this.description = "Cardiology_Public. You should not access this skill."
                  + " It is only used internally, by the Cardiology project.";
  }

  do_configure_patient({ email, key }) {
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
};
