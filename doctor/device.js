"use strict";

const Tp = require('thingpedia');
const TT = require('thingtalk');
const uuid = require('uuid');
const crypto = require('crypto');

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

    Tp.Helpers.Http.post("https://almond-cardiology.herokuapp.com/signup", data, options)
    .catch(err => {
      console.error(err);
    });
  }

  _findPrimaryIdentity(identities) {
      var other = null;
      var email = null;
      var phone = null;
      for (var i = 0; i < identities.length; i++) {
          var id = identities[i];
          if (id.startsWith('email:')) {
              if (email === null)
                  email = id;
          } else if (id.startsWith('phone:')) {
              if (phone === null)
                  phone = id;
          } else {
              if (other === null)
                  other = id;
          }
      }
      if (phone !== null)
          return phone;
      if (email !== null)
          return email;
      if (other !== null)
          return other;
      return null;
  }

  /*
   * Add a patient
   */
  async do_add_patient({ email }) {
    const key = crypto.randomBytes(16).toString("hex");

    // TODO: database call

    const identities = this.engine.messaging.getIdentities();
    const identity = this._findPrimaryIdentity(identities);

    const principal = await engine.messaging.getAccountForIdentity("email:" + email);
    if (!principal)
      throw new Error("This patient does not have a Matrix account");

    const code = `now => @org.thingpedia.cardiology.public.configure_patient(
      email="${email}", key="${key}"
    );`
    const program = TT.Grammar.parse(code);

    const uniqueId = 'uuid-' + uuid.v4();
    await engine.remote.installProgramRemote(principal, identity, uniqueId, program);
  }

  /*
   * Returns a patient's blood pressure readings.
   */
  get_readings({ username }) {
    let path = '/retrieve?username=' + username + '&doctor_username=' + this.state.username + '&doctor_password=' + this.state.password;

    return Tp.Helpers.Http.get("https://almond-cardiology.herokuapp.com" + path).then((result) => {
      return JSON.parse(result.toString());
    }).then(reading => {
      return reading;
    }).catch(err => {
      console.error(err);
      return [];
    });
  }

  /*
   * Returns a patient's critical blood pressure readings.
   */
   async get_critical_readings({ username, cutoff }) {
     let measurements = await this.get_readings({ username });

     let critical_measurements = [];
     for (let i = 0; i < measurements.length; i++) {
       let systolic = measurements[i].systolic;
       let diastolic = measurements[i].diastolic;
       if (systolic >= systolic_cutoff) || (diastolic >= diastolic_cutoff) {
         critical_measurements.push(measurements[i]);
       } else {
         console.log('No critical measurements exceed the cutoff');
       }
     }

     return critical_measurements;
   }

   /*
    * Returns whether or not a patient has any critical blood pressure readings.
    */
   async get_are_critical_readings({ username, cutoff }) {
     let critical_measurements = await this.get_critical_readings({ username, cutoff });
     return [{ answer: critical_measurements.length !== 0 }];
   }

  /*
   * Returns the number of blood pressure readings that a patient has.
   */
  async get_number_readings({ username }) {
    let measurements = await this.get_readings({ username });
    return [{ number: measurements.length }];
  }

  /*
   * Returns the number of critical blood pressure readings that a patient has.
   */
  async get_number_critical_readings({ username, cutoff }) {
    let critical_measurements = await this.get_critical_readings({ username, cutoff });
    return [{ number: critical_measurements.length }];
  }
};
