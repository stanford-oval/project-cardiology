"use strict";

const Tp = require('thingpedia');

let options = {
  dataContentType: "application/json"
};

module.exports = class Cardiology_Doctor extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.name = "Cardiology_Doctor Account for " + this.state.username;
    this.description = "This is your Cardiology Doctor Account. You can use it"
      + " to automatically remind patients to measure their blood pressure.";

    /* Stores the doctor's credentials in our database */
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

  /*
   * Returns a patient's blood pressure readings.
   */
  get_readings({ username }) {
    let path = '/retrieve?username=' + username + '&doctor_username=' + this.state.username + '&doctor_password=' + this.state.password;

    return Tp.Helpers.Http.get("https://almond-cardiology.herokuapp.com" + path).then((result) => {
      return JSON.parse(result.toString());
    }).catch(err => {
      console.error(err);
    });
  }

  /*
   * Returns a patient's critical blood pressure readings.
   */
   async get_critical_readings({ username, cutoff }) {
     let measurements = await this.get_readings({ username });

     let critical_measurements = [];
     for (let i = 0; i < measurements.length; i++) {
       let reading = measurements[i].measurement;
       if (reading >= cutoff) {
         critical_measurements.push(measurements[i]);
       }
       else {
         console.log('No critical measurements exceeds cutoff')
       }
     }

     return critical_measurements;
   }

   /*
    * Returns whether or not a patient has any critical blood pressure readings.
    */
   async get_are_critical_readings({ username, cutoff }) {
     let critical_measurements = await this.get_critical_readings({ username, cutoff });
     return critical_measurements.length !== 0
   }

  /*
   * Returns the number of blood pressure readings that a patient has.
   */
  async get_number_readings({ username }) {
    let measurements = await this.get_readings({ username });
    return measurements.length;
  }

  /*
   * Returns the number of critical blood pressure readings that a patient has.
   */
  async get_number_critical_readings({ username, cutoff }) {
    let critical_measurements = await this.get_critical_readings({ username, cutoff });
    return critical_measurements.length;
  }
};
