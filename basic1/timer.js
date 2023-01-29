// --------------------------------------------------------------------
// class representing a timer that can pull events
// watchfrog #104

										// inherit the base methods and variables
dtack_timer_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_timer_c.prototype.constructor = dtack_timer_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_timer_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_timer_c";

	this.parent = dtack_base2_c.prototype;

	if (classname == undefined)
	  classname = F;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, dtack_environment, classname);
  }
}

// -----------------------------------------------------------------------------------
// timer functions
// watchfrog #43
// to fire just once after short delay
// {
//   "period": "100",
//   "maximum_repetitions": "1",
//   "immediate": "no",
//   "opaque": "something"
// }

dtack_timer_c.prototype.timer_start = function(event_object, event_name, options)
{
  var F = "timer_start";
                                        /* we already have this timer? */
  if (this.timer_object != undefined &&
      this.timer_object.timer != undefined)
  {
                                        /* cease its firing */
    this.timer_cease(event_name);
  }

  if (options == undefined)
    options = new Object();

  this.timer_object = {
    "event_object": event_object,
    "event_name": event_name,
    "options": options,
    "timer": undefined,
    "repetitions": 0
  }

  var period = this.timer_object["options"]["period"];
  if (period == undefined)
    period = 1000;

  this.timer_object.maximum_repetitions = this.timer_object["options"]["maximum_repetitions"];
  if (this.timer_object.maximum_repetitions == undefined)
   this.timer_object.maximum_repetitions = -1;

                                        /* light this timer off immediately */
  if (this.timer_object["options"]["immediate"] != "no")
    this.timer_event(event_name);

  var that = this;
                                        /* set a timer to call it again after the period */
  this.timer_object.timer = setInterval(
    function()
    {
      that.timer_event(that.timer_object.event_name);
    },
    period);

    // don't put debug in this routine because maybe we're calling
    // it because we want a new thread and debug on the old thread might interfere
//  this.debug(F, "starting timer on " + event_name +
//    " for maximum repetitions " + timer_object.maximum_repetitions);

} // end method

// -----------------------------------------------------------------------------------

dtack_timer_c.prototype.timer_cease = function(event_name)
{
  var F = "timer_cease";

  if (this.timer_object == undefined)
    return;
                                        /* timer has been shut off? */
  if (this.timer_object.timer == undefined)
  {
    this.timer_object = undefined;
    return;
  }

  clearInterval(this.timer_object.timer);

  this.timer_object.timer = undefined;

  this.timer_object = undefined;


} // end method

// -----------------------------------------------------------------------------------

dtack_timer_c.prototype.timer_event = function(event_name)
{
  var F = "timer_event";

  if (this.timer_object == undefined)
    return;
                                        /* timer has been shut off? */
  if (this.timer_object.timer == undefined)
    return;

  if (this.timer_object.maximum_repetitions != -1 &&
      this.timer_object.repetitions >= this.timer_object.maximum_repetitions)
  {
    this.timer_cease(event_name);
    return;
  }

  this.timer_object.repetitions++;

                                        /* put the event trigger */
                                        // if caller gave options.opaque, return that in the event trigger
                                        // otherwise return "this" for backwards compatability
                                        // watchfrog #114
  this.timer_object.event_object.pull_triggers(
    event_name,
    this.timer_object.options.opaque != undefined?
      this.timer_object.options.opaque:
      this.timer_object.event_object);

} // end method

