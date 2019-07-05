"use strict";

const Tp = require('thingpedia');
const twilio = require('twilio'); // https://www.twilio.com

// These values can be found in the Twilio console.
// WARNING: Need to replace these for production. This is just a test account --
// no billing information is attached. In production, we will not store the
// AUTH_TOKEN on GitHub.
const TWILIO_ACCOUNT_SID = 'ACe43881bb16f358819e5e0150b7d30f2b';
const TWILIO_AUTH_TOKEN = 'a231bfe257bb39db74731b7e354441da';
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/*
 * Formats the ruleset so that it is readable by humans.
 */
function format_instructions(times, triggers) {
  let instructions = null;

  // TODO: Insert code here

  return instructions;
}

module.exports = class Cardiology extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology-" + this.state.userId;
    this.name = "Cardiology Account for " + this.state.screenName;
    this.description = "This is your Cardiology Account. You can use it to"
      + " remind patients to track their blood pressure regularly.";

    this._times = null;
    this._triggers = null;
  }

  /*
   * Get alerts about potentially dangerous blood pressure readings
   */
  get_alerts() {
    let alerts = null;

    // TODO: Insert code here

    return [{ feed: alerts }];
  }

  /*
   * Create instructions to measure blood pressure
   */
  do_create_ruleset({ times, triggers }) {
    // TODO: Use basic NLP / UI to standardize times and triggers

    // Placeholder code
    this._times = times;
    this._triggers = triggers;
  }

  /*
   * Get the instructions to measure blood pressure that were most
   * recently created
   */
  get_instructions() {
    let instructions = format_instructions(this._times, this._triggers);
    return [{ instructions: instructions }];
  }

  /*
   * Update times at which the patient should record their blood pressure
   */
  do_update_times({ times }) {
    // TODO: Use basic NLP / UI to standardize times

    this._times = times;
  }

  /*
   * Update blood pressure measurements at which you should be automatically
   * notified
   */
  do_update_triggers({ triggers }) {
    // TODO: Use basic NLP / UI to standardize triggers

    this._triggers = triggers;
  }

  /*
   * Send the blood pressure measurement instructions to the
   * patient's virtual assistant.
   * Each patient is uniquely identified by their phone number
   */
  do_send_ruleset({ phone_number }) {
    let instructions = format_instructions(this._times, this._triggers);

    // Sends the SMS message through Twilio
    client.messages.create({
      to: phone_number,
      from: '17149474157', // Twilio trial phone number
      body: JSON.stringify({
        times: this._times,
        triggers: this._triggers,
        instructions: instructions
      })
    });
  }
};
