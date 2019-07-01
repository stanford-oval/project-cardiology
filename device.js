"use strict";

const Tp = require('thingpedia');

module.exports = class Cardiology extends Tp.BaseDevice {
  constructor(engine, state) {
    super(engine, state);

    this.uniqueId = "me.cardiology-" + this.state.userId;
    this.name = "Cardiology Account for " + this.state.screenName;
    this.description = "A virtual assistant, based on Almond, that helps doctors"
      + " remind patients to track their blood pressure regularly."
      + "This is the account for " + this.state.screenName;
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
    ruleset = null;

    // TODO: Insert code here

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
   * patient's virtual assistant
   */
  do_send_ruleset() {
    // TODO: Insert code here
  }
};
