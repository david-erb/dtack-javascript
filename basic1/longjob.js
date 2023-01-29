// --------------------------------------------------------------------
// class representing panel-specific functions

										// inherit the base methods and variables
dtack_longjob_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_longjob_c.prototype.constructor = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_longjob_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_longjob_c";
    
										/* call the base class constructor helper */
	dtack_base2_c.prototype.constructor.call(
	  this, 
	  dtack_environment, 
	  classname != undefined? classname: F);

    this.parent = dtack_base2_c.prototype;
   }

} // end constructor

// -------------------------------------------------------------------------------

dtack_longjob_c.prototype.launch = function(options)
{
  var F = "launch";

  this.options = options;

  this.debug(F, "communicating with server to launch");

  var that = this;

										/* launch the request to create a progress record */
  var doreq_object = new dtack_doreq_c(this.dtack_environment);
  doreq_object.transport_mode = this.options.progress_transport_mode;
  doreq_object.attach_trigger("returned", function(adoreq_object) {that.progress_created(adoreq_object);});
  doreq_object.request(this.options.progress_create_url);

} // end method

// -------------------------------------------------------------------------------

dtack_longjob_c.prototype.progress_created = function(doreq_object)
{
  var F = "progress_created";

  if (doreq_object.returned_object.error != undefined)
  {
	this.debug(F, "error creating progress: " + doreq_object.returned_object.error);
	this.doreq_object = doreq_object;
	this.pull_triggers("error", this);
	return;
  }
  
  this.progress_autoid = doreq_object.response_object.autoid;
  this.progress_entry_autoid = 0;

  this.debug(F, "progress #" + this.progress_autoid + " created");

  var that = this;
  
  var url = this.options.process_launch_url;

  url = url.replace(
	/%progress_autoid%/,
	this.progress_autoid);


										/* launch the actual process */
  var doreq2_object = new dtack_doreq_c(this.dtack_environment);
  doreq2_object.transport_mode = this.options.process_launch_transport_mode;
  doreq2_object.attach_trigger("returned", function(adoreq_object) {that.process_finished(adoreq_object);});
  doreq2_object.request(url);

										/* what to do every pester period */
  this.attach_trigger("pester",
    function(triggered_object) 
    {
	  that.pester_start();
	});

										/* pester for results starting now */

  this.timer_start("pester",
    {
	  "maximum_repetitions": 1,
	  "immediate": "no"
    });
} // end method

// -------------------------------------------------------------------------------

dtack_longjob_c.prototype.pester_start = function(doreq_object)
{
  var F = "pester_start";

  var that = this;

  var url = this.options.progress_pester_url;

  url = url.replace(
	/%progress_autoid%/,
	this.progress_autoid);

  url = url.replace(
	/%progress_entry_autoid%/,
	this.progress_entry_autoid);

  var doreq2_object = new dtack_doreq_c(this.dtack_environment);
  doreq2_object.transport_mode = this.options.progress_transport_mode;
  doreq2_object.attach_trigger("returned", function(adoreq_object) {that.pester_finished(adoreq_object);});
  doreq2_object.request(url);

} // end method

// -------------------------------------------------------------------------------

dtack_longjob_c.prototype.process_finished = function(doreq_object)
{
  var F = "process_finished";
 
  this.debug(F, "finished the main process");

  this.finished = "yes";
										/* stop triggering timed pesters */
  this.timer_cease("pester");
										/* remember the response from the process */
  this.doreq_object = doreq_object;

  this.pull_triggers("finished", this);

										// run a final pester to get the results
  this.pester_start();

} // end method

// -------------------------------------------------------------------------------

dtack_longjob_c.prototype.pester_finished = function(doreq_object)
{
  var F = "pester_finished";
 
										/* let the caller know we got some pester data */
  this.pull_triggers("pestered", doreq_object.response_object);

  this.debug(F, "pestered");

  if (this.finished != "yes")
  {
										/* pester for results starting now */
	this.timer_start("pester",
      {
	    "maximum_repetitions": 1
	  });
  }

} // end method
