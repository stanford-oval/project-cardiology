"use strict";

const Tp = require('thingpedia');
const twilio = require('twilio'); // https://www.twilio.com

// These values can be found in the Twilio console.
const TWILIO_ACCOUNT_SID = 'ACe43881bb16f358819e5e0150b7d30f2b';
const TWILIO_AUTH_TOKEN = 'a231bfe257bb39db74731b7e354441da';
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/*
 * Formats the ruleset so that it is readable by humans.
 */
function format_ruleset(ruleset) {
  // TODO: Insert code here

  return ruleset;
}

module.exports = class Cardiology extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "cardiology-" + this.state.userId;
    this.name = "Cardiology Account for " + this.state.screenName;
    this.description = "This is your Cardiology Account. You can use it to"
      + " remind patients to track their blood pressure regularly.";

    this._ruleset = null;
    this._feed = null;
  }

  /*
   * Get alerts about potentially dangerous blood pressure readings
   */
  get_alerts() {
    alerts = null;

    // TODO: Insert code here

    return [{ feed: alerts }];
  }

  /*
   * Create instructions to measure blood pressure
   */
  do_create_ruleset({ instructions }) {
    // TODO: Insert code here
  }

  /*
   * Get the instructions to measure blood pressure that were most
   * recently created
   */
  get_ruleset() {
    var ruleset = this._ruleset;
    ruleset = format_ruleset(ruleset);
    return [{ ruleset: ruleset }];
  }

  /*
   * Make corrections to the blood pressure measurement instructions
   * before sending
   */
  do_edit_ruleset({ instructions }) {
    // TODO: Insert code here
  }

  /*
   * Send the blood pressure measurement instructions to the
   * patient's virtual assistant.
   * Each patient is uniquely identified by their phone number
   */
  do_send_ruleset({ phone_number }) {
    var ruleset = this._ruleset;
    ruleset = format_ruleset(ruleset);

    // Sends the SMS message through Twilio
    client.messages.create({
      to: phone_number,
      from: '17149474157', // Twilio trial number
      body: ruleset
    });
  }
};
