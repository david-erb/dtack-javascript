
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.issue_ajax_xml_command = function(action, guts_xml, trigger_string, trigger_object, options)
{
  var F = "issue_ajax_xml_command";
   
  var xml = 
    "<request>" +
    "<commands>" +
    "<command action=\"" + action + "\">" +
    guts_xml +
    "</command>" +
    "</commands>" +
    "</request>";
  
  var that = this;
                                        // instantiate a new ajax object
  var ajax_object = new dtack_ajax2_c(dtack_environment);
  
  ajax_object.trigger_string = trigger_string;
  ajax_object.trigger_object = trigger_object;
  
                                        // specify the handler to be called when the request finishes
  ajax_object.attach_trigger(
    "finished", 
    function(triggered_object)
    {
	  that.handle_ajax_xml_finished(triggered_object);
	});

  ajax_object.post(
    "../ajax/command.php",
    xml);

} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_page_base_c.prototype.handle_ajax_xml_finished = function(ajax_object)
{
  var F = "handle_ajax_xml_finished";
  
                                        // check response from a ajax, return just the response object from within the xml
  var response = this.check_ajax_xml_response(ajax_object);
  
  if (response !== null)
  {
  	if (ajax_object.trigger_string !== undefined &&
  	    ajax_object.trigger_string !== null &&
  	    ajax_object.trigger_object !== undefined &&
  	    ajax_object.trigger_object !== null)
  	{
  	  ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response);
	}
  }
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// ----------------------------------------------------------------------------
// check response from a ack_page ajax, return just the response object from within the xml structure (or null if error)

dtack_page_base_c.prototype.check_ajax_xml_response = function(ajax_object)
{
  var F = "check_ajax_xml_response";

  var response = null;
  
  var http_code = parseInt(ajax_object.http_code, 10);
  
  if (isNaN(http_code))
  {
  	this.notify_ajax_xml_failure(
  	  "unable to access ack_page url:" +
  	  " the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code != 200)
  {
    this.notify_ajax_xml_failure("unexpected http code " + http_code);
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
      this.notify_ajax_xml_failure(message)
	}
	
	var $response = $(xml).find("response");
	var $exceptions = $(xml).find("exceptions");
	var $exceptions_count = $($exceptions).find("count");
	var exceptions_count = parseInt($exceptions_count.html());
	
	if ($response.length === 0)
	{
	  this.notify_ajax_xml_failure("no response provided in ajax xml");
	}
	else
	if ($exceptions.length === 0)
	{
	  this.notify_ajax_xml_failure("no exceptions provided by server");
	}
	else
	if ($exceptions_count.length === 0)
	{
	  this.notify_ajax_xml_failure("no exceptions.count provided by server");
	}
	else
	if (isNaN(exceptions_count))
	{
	  this.notify_ajax_xml_failure("invalid exceptions.count provided by server");
	}
	else
	if (exceptions_count > 0)
	{
	  var warning = "found " + exceptions_count + " exceptions";
//	  var warning = "";
//	  for (var k in json.response.exceptions)
//	  {
//	  	if (k == "count")
//	  	  continue;
//	  	  
//	  	var exception = json.response.exceptions[k];
//	  	
//	  	if (exception.phase == "authorize")
//	  	{
//	  	  warning += "unable to check the page load count: there was an authorization failure";
//		}
//		else
//		{
//  	  	  warning += "phase: " + exception.phase + "\n";
//	  	  warning += "message: " + exception.message + "\n";
//	  	  warning += "stacktrace:\n" + exception.stacktrace + "\n";
//		}
//	  }
	  this.notify_ajax_xml_failure(warning);
	}
    else
    {
      response = $response;
	}
  }

  return response;
                                   
} // end method
                                                        
// ----------------------------------------------------------------------------
// called with an ajax had detected any kind of error
// the theory is that failures are pervasive (not sporadic) at the server end
// so no real need for the page to recover and continue
// we just keep reporting each one as it happens with an alert

dtack_page_base_c.prototype.notify_ajax_xml_failure = function(details)
{
  
  //this.dialog_ajax_xml_failure(details);
 
  this.alert_ajax_xml_failure(details);
  
} // end method

// ----------------------------------------------------------------------------

dtack_page_base_c.prototype.alert_ajax_xml_failure = function(details)
{
  var message = 
    "Server Communications Failure\n\n" +
    "There has been an error communicating with the server.\n\n" +
    "The auto-save is no longer working, so changes you make on this page will not be saved.\n" +
    "You can try to move to another page and continue your work.\n" +
    "If this error continues on other pages, please contact Technical Support.\n\n" +
    "Here are some details:\n" +
    details;
  
  alert(message);
  
} // end method



// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_user_preference = function(keyword, value, options)
{
  var F = "update_user_preference";
  
  if (!this.user_preferences_ajax_issuer)
  {
  	this.debug(F, "cannot issue ajax to update user preference because dtack_page_base_c.user_preferences_ajax_issuer is not set");
  	return;
  }
  
  this.assert("dtack_page_base_c.user_preferences_ajax_issuer is not set", this.user_preferences_ajax_issuer);
  
  var page_name = this.option_value(options, "page_name", null);
  
  if (page_name === null)
    page_name = this.host_value("user_preferences.page_name", null);
  
  if (page_name === null)
  {
  	this.debug(F, "not ajaxing because no host user_preferences.page_name has been defined");
  	return;
  }
  
  var s = "";
  for (var k in this.dtack_environment.settings.host.user_preferences)
  {
  	s += (s == ""? "": ", ") + k;
  }
  
  //this.debug_verbose(F, "dtack_environment.settings.host.user_preferences keys are: {" + s + "}");

  this.user_preferences_ajax_issuer.issue_command(
    "update_user_preference", 
    "<page_name>" + this.dtack_environment.escape_xml(page_name) + "</page_name>" +
    "<keyword>" + this.dtack_environment.escape_xml(keyword) + "</keyword>" +
    "<value>" + this.dtack_environment.escape_xml(value) + "</value>",
    null, 
    null, 
    options);

} // end method

