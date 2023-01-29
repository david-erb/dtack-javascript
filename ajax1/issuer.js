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

                                        // add low level enhancement to ajax issuer to allow a waiting (modal) indicator for a specific ajax call
                                        // watchfrog #226
var dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX = "dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX";

try
{
										// inherit the base methods and variables
  dtack__ajax__issuer_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack__ajax__issuer_c.prototype.parent = dtack_base2_c;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// --------------------------------------------------------------------
// force caller to provide url argument to ajax_issuer constructor
// watchfrog #200

function dtack__ajax__issuer_c(ajax_watcher, url, options)
{
  var F = "dtack__ajax__issuer_c";
  
  this.ajax_watcher = ajax_watcher;
  
										// initilialize the base instance variables
  this.construct(this.ajax_watcher.dtack_environment, F);
  
                                        // push the class hierarchy so debug_verbose may be used
  this.push_class_hierarchy(F);

  this.CONSTANTS = {};
  this.CONSTANTS.TRIGGERS = {};
  this.CONSTANTS.TRIGGERS.FOUND_EXCEPTION_IN_RESPONSE = "dtack__ajax__issuer_c::CONSTANTS.TRIGGERS.FOUND_EXCEPTION_IN_RESPONSE";
                          
  this.dashboard_connection = null;

  if (url === undefined)
  {
  	throw F + ": missing url argument";
  }
  else
  if (url.substring(0, 4).toLowerCase() != "http" &&
      url.substring(0, 4).toLowerCase() != "file" &&
                                        // allow the url to be relative to the "current" page
                                        // as of this time, this probably only works for the dashboard_connection, not real ajax
      url.substring(0, 3) != "../")
  {
  	throw F + ": url argument does not start with http or file or ../";
  }
  else
  {
    this.url = url;
  }                                             
  
  this.options = options;
  if (!this.options)
    this.options = new Object();

                                        // C#TOOLHOST 1. ajax issuer will use dashboard connection instead of real ajax if provided in its constructor options  
  if (this.options.dashboard_connection)
  {
    this.dashboard_connection = this.options.dashboard_connection;
    this.debug_verbose(F, "options contains a dashboard connection");
  }
  
} // end class

// -------------------------------------------------------------------------------

dtack__ajax__issuer_c.prototype.issue_command = function(action, guts_xml, trigger_string, trigger_object, options)
{
  var F = "dtack__ajax__issuer_c::issue_command";
   
  //throw "deliberate";
  
  var xml = 
    "<request>" +
    "<commands>" +
    "<command action=\"" + action + "\">" +
    guts_xml +
    "</command>" +
    "</commands>" +
    "</request>";
  
  var that = this;
  
                                        // we have been given a dashboard connection to work with?
  if (this.dashboard_connection &&
      this.dashboard_connection.registered)
  {                                          

                                        // let the dashboard connection take care of the Ajax handshaking
                                        // this is entirely synchronous, JavaScript will be waiting for the response
                                        // in the case of an executable based on the dtack.toolhost,
                                        // this will typically result in the dynamic loading and lifecycle of an ajax demand
    var response_xml_text = this.dashboard_connection.send_ajax(this.url, xml, true);
                                                   
                                        // check response from a ajax, return just the response object from within the xml
    var $response = this.check_result_xml_text(null, response_xml_text);
    
                                        // anybody signed up for any triggers on this ajax completion?
    if (    
      trigger_object !== undefined &&
      trigger_object !== null &&
      trigger_string !== undefined &&
      trigger_string !== null)
    {
                                        // trigger those who are waiting, just as if an asynchronous ajax is finished
      trigger_object.pull_triggers(trigger_string, $response);
    }
  }
                                        // we have not been given a dashboard connection to work with?
  else
  {
                                        // instantiate a new ajax object
    var ajax_object = new dtack_ajax2_c(dtack_environment);
   
    ajax_object.action = action;
    ajax_object.trigger_string = trigger_string;
    ajax_object.trigger_object = trigger_object;
  
    this.register_start(ajax_object, options);
  
                                        // specify the handler to be called when the request finishes
    ajax_object.attach_trigger(
      "finished", 
      function(triggered_object)
      {
	    that.handle_finished(triggered_object);
  	  });

    ajax_object.post(
      this.url,
      xml);
  }

} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack__ajax__issuer_c.prototype.handle_finished = function(ajax_object)
{
  var F = "dtack__ajax__issuer_c::handle_finished";
  
                                        // check response from a ajax, return just the response object from within the xml
  var response = this.check_response(ajax_object);

  this.debug_verbose(F, "response is " + this.vts(response));
  
  if (response !== null &&
      ajax_object.trigger_object !== undefined &&
      ajax_object.trigger_object !== null &&
      ajax_object.trigger_string !== undefined &&
      ajax_object.trigger_string !== null)
  {
  	this.debug_verbose(F, "ajax command action " + this.vts(ajax_object.action) + 
      " finished, now triggering " + this.vts(ajax_object.trigger_string));
  	try
  	{
  	  ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response);
	}
	catch(exception)
	{
	  var message =  exception.name;
      if (message != undefined)
	    message = exception.name + ": " + exception.message;
      else
	    message = exception;
  	  this.debug_verbose(F, "ajax command action " + this.vts(ajax_object.action) + 
  	    " finished, but failed to trigger " + this.vts(ajax_object.trigger_string) + 
  	    " because: " + message);
	  
	}
  }
  else
  {
  	this.debug_verbose(F, "ajax command action \"" + ajax_object.action + "\" finished, not triggering because no trigger object specified");
  }
  
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// ----------------------------------------------------------------------------
// check response from a ack_page ajax, return just the response object from within the xml structure (or null if error)

dtack__ajax__issuer_c.prototype.check_response = function(ajax_object)
{
  var F = "dtack__ajax__issuer_c::check_response";

                                        // clean up logic for how ajax issuer response is checked and returned
                                        // watchfrog #201
  var should_return_null = true;
  var $response = null;
  
  var http_code = parseInt(ajax_object.http_code, 10);
  
  if (isNaN(http_code))
  {
  	this.register_failure(
  	  ajax_object,
  	  "unable to access ack_page url:" +
  	  " the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code != 200)
  {
    this.register_failure(ajax_object, "unexpected http code " + http_code);
  }
  else
  {
  	var xml = undefined;
  	
	try
	{
									// the body should be a xml object definition
	  xml = ajax_object.xhttp.responseXML;
	}
									/* could not parse the response? */
	catch(exception)
	{
	  var message; 
	  if (exception.name != undefined)
		message = exception.name + ": " + exception.message;
	  else
		message = exception;
                                    		
	  message = "invalid XML response: " + message;
      this.register_failure(ajax_object, message)
	}
	
	if (xml)
	{                                                   
	                                    // use common routine to parse xml failures in ajax response
	                                    // watchfrog #242                              
	  return this.check_result_xml(ajax_object, $(xml));
	}
  }                           

  if (should_return_null)
    return null;
    
  return $response;
                                   
} // end method

// ----------------------------------------------------------------------------
// check a text object which is supposed to be xml returned from projx ajax
// for some reason, the fileupload won't give pre-parse ajax, so we have to it here ourself
// NOTE!! ajax_object may be null (such as when called from mini_filuploader)

dtack__ajax__issuer_c.prototype.check_result_xml_text = function(ajax_object, xml_text)
{
  var F = "check_result_text";

                                        // NOTE!! ajax_object may be null (such as when called from mini_filuploader)
  //this.assert("ajax_object argument is " + this.vts(ajax_object), ajax_object);
  this.assert("xml_text argument is " + this.vts(xml_text), xml_text);
                                      
  var xml = undefined;
  
  try
  {
    xml = $.parseXML(xml_text);
  }
  catch(exception)
  {
  	var message; 
	if (exception.name != undefined)
	  message = exception.name + ": " + exception.message;
	else
	  message = exception;

	this.register_failure(ajax_object, "failed to parse response: " + message);
  }
            
  if (xml)
    return this.check_result_xml(ajax_object, $(xml));
  else
    return "";
             
} // end method

// ----------------------------------------------------------------------------
// check for exceptions and other missing or bad things in the xml response from projx ajax
// this presumes the server gave something back and it has already been parsed into xml
// NOTE!! ajax_object may be null (such as when called from mini_filuploader and dashboard-based ajax)

dtack__ajax__issuer_c.prototype.check_result_xml = function(ajax_object, $xml)
{
  var F = "check_result_xml";
                                                                                                          
                                        // clean up logic for how ajax issuer response is checked and returned
                                        // watchfrog #201
  var should_return_null = true;
	
  var $response = $xml.find("response");
  var $exceptions = $xml.find("exceptions");
  var $exceptions_count = $exceptions.find("count");
  var exceptions_count = parseInt($exceptions_count.text());
  
  if ($response.length === 0)
  {
	this.register_failure(ajax_object, "no response provided in ajax xml");
  }
  else
  if ($exceptions.length === 0)
  {
	this.register_failure(ajax_object, "no exceptions provided by server");
  }
  else
  if ($exceptions_count.length === 0)
  {
	this.register_failure(ajax_object, "no exceptions.count provided by server");
  }
  else
  if (isNaN(exceptions_count))
  {
	this.register_failure(ajax_object, "invalid exceptions.count provided by server");
  }
  else
  if (exceptions_count > 0)
  {
	
	var trigger_object = 
	{
	  ajax_object: ajax_object, 
	  xml: $xml,
	                                    // this can be set to false by any of the trigger handlers
	  should_register_failure: true
	};
	
	                                    // pull a specific trigger when exceptions are discovered in the ajax response
                                        // note the trigger object as a return value in it, namely: should_register_failure 
	                                    // watchfrog #243
	this.debug_verbose(F, "pulling " + this.vts(this.CONSTANTS.TRIGGERS.FOUND_EXCEPTION_IN_RESPONSE));
	this.pull_triggers(this.CONSTANTS.TRIGGERS.FOUND_EXCEPTION_IN_RESPONSE, trigger_object);
	
	if (trigger_object.should_register_failure)
	{
  	  var warning = "found " + exceptions_count + " exceptions\n";
  	  
	  $exceptions.children().each(
	    function(index, exception)
	    {
	      var $message = $(this).find("message");
	      if ($message.length !== 0)
	      {
  	        var $phase = $(this).find("phase");
	        if ($phase.length > 0)
	          warning += "phase " + $phase.text() + ": ";
	        
	        warning += $message.text() + "\n";
		  }
	    }
	  );
	  
	  this.register_failure(ajax_object, warning);
	}
  }
  else
  {
    this.register_success(ajax_object);
    should_return_null = false;
  }

  if (should_return_null)
    return null;
    
  return $response;
                                   
} // end method


// -------------------------------------------------------------------------------

dtack__ajax__issuer_c.prototype.register_start = function(ajax_object, options)
{
  var F = "register_start";

  this.assert("ajax_object parameter is " + this.vts(ajax_object), ajax_object);
  
  this.ajax_watcher.register_start();

  ajax_object[dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX] = this.option_value(options, dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX, "yes");
  
  this.debug_verbose(F, "options[should_inhibit_waitix] is " + this.vts(ajax_object[dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX]));

                                        // we should should waitix for this request?
  if (!this.is_affirmative_option(ajax_object, dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX))
  {
  	

    dtack_page_waitix.show("please wait...");
  	
  }
  
} // end method    

// -------------------------------------------------------------------------------
// NOTE!! ajax_object may be null (such as when called from mini_filuploader)

dtack__ajax__issuer_c.prototype.register_success = function(ajax_object)
{
  var F = "register_success";

  //this.assert("ajax_object parameter is " + this.vts(ajax_object), ajax_object);
  
  this.ajax_watcher.register_success();

                                        // we are showing waitix for this request?
  if (ajax_object && !this.is_affirmative_option(ajax_object, dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX))
  {
    dtack_page_waitix.hide();
  }
  
} // end method                          
                                    
// -------------------------------------------------------------------------------
// NOTE!! ajax_object may be null (such as when called from mini_filuploader)

dtack__ajax__issuer_c.prototype.register_failure = function(ajax_object, details)
{
  var F = "register_failure";

  //this.assert("ajax_object parameter is " + this.vts(ajax_object), ajax_object);

  this.ajax_watcher.register_failure(details);

                                        // we are showing waitix for this request?
  if (ajax_object && !this.is_affirmative_option(ajax_object, dtack__ajax__issuer_c__OPTIONS__SHOULD_INHIBIT_WAITIX))
  {
    dtack_page_waitix.hide();
  }
  
} // end method                          
                 