/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! THIS FILE IS TO BE TREATED WITH "TRADE SECRET" CARE
  ! Copyright (C) 2005 Dtack Inc. All Rights Reserved
  ! To use this file, you must have signed a license agreement with Dtack Inc.
  ! Under no circumstances may you redistribute this file.
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents a single script conversation with the server
// script is a protocol for client/server interaction using dom script nodes

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_script_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_script_c.prototype.parent = dtack_base2_c;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// --------------------------------------------------------------------
function dtack_script_c(dtack_environment, classname)
{
  var F = "dtack_script_c";
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_script_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  dtack_environment, 
	  classname != undefined? classname: F);

  }

  this.scriptserver = "default";

} // end class

// -------------------------------------------------------------------------------
// request something to the server

dtack_script_c.prototype.request = function(url, cgi)
{
  var F = "request";

  this.doreq_object = new dtack_doreq_c(this.dtack_environment);

  var that = this;
										/* listen for the doreq response */
  this.doreq_object.attach_trigger(
	"returned", 
	function(doreq_object) {that.returned(doreq_object);});

										/* issue the doreq request */
  this.doreq_object.request(url, cgi);

} // end method

// -------------------------------------------------------------------------------
// handle return from script

dtack_script_c.prototype.returned = function(doreq_object)
{
  var F = "returned";
										/* keep a reference to the object which was returned */
  this.returned_object = doreq_object.returned_object;

  this.response_object = this.returned_object.response;

										/* let any listeners know that we returned */
  this.pull_triggers("returned", this);
	
										/* can maybe remove script node from the dom now? */
} // end method
