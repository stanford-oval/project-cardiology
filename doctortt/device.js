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
   * Retrieves the patient's blood pressure measurements from the databse
   */
  get_measurements({ username }) {
    let path = '/retrieve?username=' + username + '&doctor_username=' + this.state.username + '&doctor_password=' + this.state.password;

    return Tp.Helpers.Http.get("https://almond-cardiology.herokuapp.com" + path).then((result) => {
      return JSON.parse(result.toString());
    }).then((measurements) => {
      console.log('Successfully retrieved measurements from database');
      return measurements;
    }).catch(err => {
      console.error(err);
    });
  }

  /*
   * Retrieves the number of blood pressure measurements from the databse
   */
  get_count({ count }) {
    let path = '/retrieve?username=' + username + '&doctor_email=' + this.state.username + '&doctor_password=' + this.state.password;

    return Tp.Helpers.Http.get("https://almond-cardiology.herokuapp.com" + path).then((result) => {
      return result.count();
    }).then((count) => {
        console.log('Sucessfully counted number of measurements');
        return count;
    });
  }

};
