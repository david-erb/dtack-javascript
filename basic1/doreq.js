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


// this object represents a single doreq conversation with the server
// doreq is a protocol for client/server interaction using dom script nodes

// wrap the prototyping in case the base class include files failed to arrive in
try
{
										// inherit the base methods and variables
  dtack_doreq_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_doreq_c.prototype.parent = dtack_base2_c;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// --------------------------------------------------------------------
function dtack_doreq_c(dtack_environment, classname)
{
  var F = "dtack_doreq_c";
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_doreq_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  dtack_environment, 
	  classname != undefined? classname: F);

	this.transport_mode = "script";
	
	this.opaque = new Object();
  }

} // end constructor

// -------------------------------------------------------------------------------
// allow requester to set up polling to happend during request
// watchfrog #121

dtack_doreq_c.prototype.poke_polling_definition = function(polling_definition)
{
  this.polling_definition = polling_definition;
} // end method

// -------------------------------------------------------------------------------
// request something to the server

dtack_doreq_c.prototype.request = function(url, cgi, options)
{
  var F = "request";
  var that = this;

										/* get us registered in the master list of doreqs */
  this.dtack_environment.doreq_register(this);

  if (url.match(/[?]/))
  {
	this.url = url + "&doreq_id=" + this.doreq_id;
  }
  else
  {
	this.url = url + "?doreq_id=" + this.doreq_id;
  }
  
                                        // when submitting a form, presumably the target is an invisible iframe
                                        // this template will wrap the doreq response code in a <script> tag
  if (this.transport_mode == "form")
  {
    this.url += "&template=doreq_iframe.js";
  }

  var now = new Date();

  this.url += "&nocache=" + now.getTime();
    
  this.debug(F, "requesting " + this.transport_mode + " url: " + this.url + " with cgi " + (cgi == undefined? "undefined": "length " + cgi.length));

  this.pull_triggers("requesting", this);

										// we are supposed to use ajax2 for the transport?
										// watchfrog #40
  if (this.transport_mode == "ajax2")
  {
                                        // pass the options to the ajax2 constructor
                                        // such as content_type for non-standard encoding
                                        // watchfrog #105
	this.ajax2_object = new dtack_ajax2_c(this.dtack_environment, options);

	this.ajax2_object.attach_trigger(
	  "finished", 
										/* ajax2 will pull this function when done */
	  function(aajax2_object)
	  {
		try
		{
	      //that.debug(F, "raw response: " + aajax2_object.http_body);

										/* the body should be a dtack_environment.doreq_returned() call */
		  eval(aajax2_object.http_body);
		}
										/* could not parse the response? */
		catch(exception)
		{
		  var message; 
		  if (exception.name != undefined)
			message = exception.name + ": " + exception.message;
		  else
			message = exception;
                                        // only FF gives this
                                        // watchfrog #57
		  var stack = exception.stack;
		  
										/* let the world know we returned */
		  that.returned({
										/* listeners are supposed to examine this error before continuing */
			"error": message,
			"stack": stack,
										/* store the text in case the triggered object wants to report it */
			"raw_response": aajax2_object.http_body
		  });

		}
										/* error or not, release the underlying xhttp object */
		that.ajax2_object.finished();
	  });
										/* initiate the request */
	this.ajax2_object.post(this.url, cgi);
  }
  else
										// we are supposed to use form for the transport?
  if (this.transport_mode == "form")
  {
    this.form_node.action = this.url;
    this.form_node.submit();
  }
  else
										// we are supposed to use window.open for the transport?
										// watchfrog #120
  if (this.transport_mode == "window.open")
  {
    this.window_object = window.open(this.url, this.window_name);
  }
  else
  {
										/* cgi is optional in request */
										// watchfrog #29
	if (cgi != undefined && cgi != "")
	  this.url += "&" + cgi;

	this.head_node = document.getElementsByTagName("head")[0];
	
	this.script_node = document.createElement("script");
	this.script_node.src = this.url;
	this.script_node.type = "text/javascript";
	
										// asynchronously load and run the script
										// the "script" must be formatted by the server
										// into a dtack_environment.doreq_returned() call
	this.head_node.appendChild(this.script_node);
  }
  
                                        // caller has defined polling parameters?
  if (this.polling_definition)
  {
    this.poll_count = 0;
                                        // start timer AFTER request has been made
                                        // watchfrog #121
    this.polling_definition.event_owner.timer_start(
      this.polling_definition.event_name, 
      this.polling_definition.timer_options);
  }

	
} // end method

// -------------------------------------------------------------------------------
// handle return from script

dtack_doreq_c.prototype.returned = function(returned_object)
{
  var F = "returned";
										/* keep a reference to the object which was returned */
  this.returned_object = returned_object;

										/* for backwards compatability */
  this.response_object = this.returned_object.response;

										/* let any listeners know that we returned */
  this.pull_triggers("returned", this);
	
										/* can maybe remove script node from the dom now? */
} // end method
