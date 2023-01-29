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


// this object represents a single ajax conversation with the server
// dtack_javascript.02-20 watchfrog #21 throughout this file
// dtack_javascript watchfrog #7 add ajax ability to recognize a js response instead of only xml

// --------------------------------------------------------------------
function dtack_ajax_c()
{
  this.classname = "dtack_ajax_c";

  this.xhttp = null;

} // end class

// -------------------------------------------------------------------------------
// caller is finished

dtack_ajax_c.prototype.finished = function()
{
  var F = "finished";
										/* release the underlying engine instance */
  this.script_object = null;

} // end method

// -------------------------------------------------------------------------------
// post something to the server

dtack_ajax_c.prototype.post = function(name, url, data, caller, callback)
{
  var F = "post";

  this.debug_identifier = name;

  this.caller = caller;
  this.callback = callback;

  var that = this;

  this.script_object = new dtack_script_c(this.dtack_environment);

  this.url = url;
										/* say what to do when script object is done */
  script_object.attach_trigger(
	"returned", 
	function(ascript_object) 
    {
	  that.returned(ascript_object);
	});
										/* submit the script object */
  script_object.request(url, "post=" + data);
	
} // end method

// -------------------------------------------------------------------------------
// this is the callback which gets called when php has responded to the script call

dtack_ajax_c.prototype.script_returned = function(script_object)
{
  var F = "returned";

  eval("this.caller." + this.callback + "(this);");

} // end method


// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED
// THIS IS WHERE I STOPPED

// --------------------------------------------------------------------
// find a particular container in the <root> <response> hierarchy

dtack_ajax_c.prototype.find_container_in_response = function(name)
{
  var F = "find_container_in_response";
										// find the "root" in the response under which all the interesting stuff hangs
										// dtack_javascript.02-20 watchfrog #20
	var root = this.find_root_in_response();

	var response = root.getElementsByTagName("response");

	if (!response)
  	  throw "no response tag found";
	
	if (response.length == 0)
	  throw "no response tag nodes";
	
	if (response.length > 1)
	  throw response.length + " response tag nodes";

	response = response[0];

	var nodes = response.getElementsByTagName(name);

	if (!nodes)
	  throw "no " + name + " tag found";

	if (nodes.length == 0)
	  throw "no " + name + " tag nodes";

	if (nodes.length > 1)
	  throw node.length + " " + name + " tag nodes";

	nodes = nodes[0];

	return nodes;

} // end method

// --------------------------------------------------------------------
// find the "root" in the response under which all the interesting stuff hangs
// dtack_javascript.02-20 watchfrog #20

dtack_ajax_c.prototype.find_root_in_response = function()
{
  var F = "find_root_in_response";

  var response_xml = this.xhttp.responseXML;

  if (response_xml == null)
    throw "no xml response";

  if (response_xml.childNodes.length == 0)
    throw "no child nodes in response";

  //dtack_environment.debug(F, "response_xml has " + response_xml.childNodes.length + " children");

  var root = null;
  for (var i=0; i<response_xml.childNodes.length; i++)
  {
	//dtack_environment.debug(F, "response_xml.childNodes[" + i + "].tagName is " + response_xml.childNodes[i].tagName);

	if (response_xml.childNodes[i].tagName == "root")
	{
	  root = response_xml.childNodes[i];
	  break;
	}
  }

  if (root == null)
  throw "no root found in response";
	
  return root;
} // end method

// --------------------------------------------------------------------
// check the response XML for error messages in the standard error tags

dtack_ajax_c.prototype.check_response_errors = function()
{
  var F = "check_response_errors";
	
  var content_type = this.xhttp.getResponseHeader("Content-Type");

  var response_jso;

  if (content_type == "text/xml")
  {
	response_jso = this.check_response_errors_xml();
  }
  else
  {
	response_jso = this.check_response_errors_jso();
  }

  return response_jso;
} // end method

// --------------------------------------------------------------------
// check the response XML for error messages in the standard error tags

dtack_ajax_c.prototype.check_response_errors_xml = function()
{
  var F = "check_response_errors_xml";
	
										// find the "root" in the response under which all the interesting stuff hangs
										// dtack_javascript.02-20 watchfrog #20
  var root = this.find_root_in_response();

  this.check_response_error(root, "system_error");
  this.check_response_error(root, "processing_error");
  this.check_response_error(root, "validation_message");

} // end method

// --------------------------------------------------------------------
// check the response XML for error messages in the standard error tags

dtack_ajax_c.prototype.check_response_errors_jso = function()
{
  var F = "check_response_errors_jso";
	

  eval("var response_jso = " + this.xhttp.responseText + ";"); 

  this.response_jso = response_jso;

  if (this.response_jso.system_error == undefined)
    throw ("the response text was formatted improperly: no system error");

  if (this.response_jso.system_error != "")
    throw ("the server indicated system_error: " + this.response_jso.system_error);

  if (this.response_jso.processing_error == undefined)
    throw ("the response text was formatted improperly: no processing error");

  if (this.response_jso.processing_error != "")
    throw ("the server indicated processing_error: " + this.response_jso.processing_error);

  if (this.response_jso.validation_message == undefined)
    throw ("the response text was formatted improperly: no validation error");

  if (this.response_jso.validation_message != "")
    throw ("the server indicated validation_message: " + this.response_jso.validation_message);

  if (this.response_jso.response == undefined)
    throw ("the response text was formatted improperly: no response");

} // end method

// --------------------------------------------------------------------
// check the response XML for error messages in the standard error tags

dtack_ajax_c.prototype.check_response_errors_jso_lax = function()
{
  var F = "check_response_errors_jso_lax";
	

  eval("var response_jso = " + this.xhttp.responseText + ";"); 

  this.response_jso = response_jso;

  if (this.response_jso.system_error != undefined &&
      this.response_jso.system_error != "")
    throw ("the server indicated system_error: " + this.response_jso.system_error);

  if (this.response_jso.processing_error != undefined &&
      this.response_jso.processing_error != "")
    throw ("the server indicated processing_error: " + this.response_jso.processing_error);

  if (this.response_jso.validation_message != undefined &&
      this.response_jso.validation_message != "")
    throw ("the server indicated validation_message: " + this.response_jso.validation_message);

  if (this.response_jso.response == undefined)
    throw ("the response text was formatted improperly: no response");

} // end method

// --------------------------------------------------------------------
// check for an error message in the given tag

dtack_ajax_c.prototype.check_response_error = function(response, tagname)
{
  var F = "check_response_error";

  var nodes = response.getElementsByTagName(tagname);

  if (!nodes)
    throw "no " + tagname + " tag found";

  if (nodes.length == 0)
    throw "no " + tagname + " tag nodes";

  if (nodes.length > 1)
    throw node.length + " " + tagname + " tag nodes";

  nodes = nodes[0];

  if (nodes.childNodes.length > 0)
  {
	throw nodes.childNodes[0].firstChild.nodeValue;
  }

} // end method

