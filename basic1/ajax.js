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
  this.post_pending_pending = 0;

  this.classname = "dtack_ajax_c";

  this.xhttp = null;

} // end class

// --------------------------------------------------------------------

dtack_ajax_c.prototype.echo_nodes = function(nodes)
{
  var F = "echo_nodes";

  var s = "";

  var i;
  for (i=0; i<nodes.childNodes.length; i++)
  {
	var node = nodes.childNodes[i];
	s += i + ". " + node.nodeName + "(tagName " + node.tagName + ")" +
	" " + (node.hasChildNodes? node.childNodes.length: "leaf") +
	"<br>\n";
  }

  return s;

} // end method

// -------------------------------------------------------------------------------
// caller is finished

dtack_ajax_c.prototype.finished = function()
  {
    var F = "finished";
										/* release the underlying engine instance */
	this.xhttp = null;

  } // end method

// -------------------------------------------------------------------------------
// post something to the server

dtack_ajax_c.prototype.post = function(name, url, data, caller, callback)
{
    var F = "post";

	var that = this;

	this.xhttp = this.find_xhttp(caller);

	this.url = url;

	//caller.debug(F, "hitting url " + url);

										//prepare the call, http method, url, true=asynchronous call
	this.xhttp.open("POST", url, true);

	  //	alert("posting " + url + "\nwith value `" + data + "'");

	this.xhttp.setRequestHeader("Content-Type", "text/plain");

										// hook the event handler
	this.xhttp.onreadystatechange = function()
	{
      var F2 = "onreadystatechange";
	  var prefix = name + ": ";

	  //caller.state(prefix + "got state change to " + that.xhttp.readyState);

	  if (that.xhttp.readyState == 4)
	  {
		if (that.xhttp.status != 200)
		{
		  caller.error(F2,
			prefix + "server notification failed: " + that.xhttp.status + " " + that.xhttp.statusText + 
			" for " + that.url);
		  caller.debug(F2,
		    that.xhttp.getAllResponseHeaders());
		  caller.debug(F2,
		    that.xhttp.responseText);
		}
		else
		{
		  eval("caller." + callback + "(that);");
		}

		caller.state(prefix + " complete");
	  }
										/* decrement count of pending auf's */
	  that.post_pending--;
	}



										/* change the text on the update button */
	caller.state(name + ": pending...");
	
										// finally send the data
	this.xhttp.send(data); 
										/* increment count of pending auf's */
	this.post_pending++;
	
} // end method

// -------------------------------------------------------------------------------

dtack_ajax_c.prototype.find_xhttp = function(caller) 
{
	var F = "find_xhttp";

	var xhttp;
										// Test for support for ActiveXObject in IE first 
										// (as XMLHttpRequest in IE7 is broken)
										// per http://www.javascriptkit.com/dhtmltutors/ajaxgetpost3.shtml
	var activex_object_names = new Array(
	// don't use 5.0 because it was for Office only
	// don't use 4.0 because it is an upgrade for but not a replacement to MSXML3 
	// MSXML 3.0 is our preferred fallback 
	// it is installed on every OS from a fully patched Win2k SP4 installation on up, so it requires zero-deployment
	// see http://blogs.msdn.com/b/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
	// watchfrog #72
	  //'Msxml2.XMLHTTP.5.0',
	  //'Msxml2.XMLHTTP.4.0',
	  'Msxml2.XMLHTTP.3.0',
	  'Msxml2.XMLHTTP',
	  'Microsoft.XMLHTTP');
	for (var i=0; i<activex_object_names.length; i++) 
	{
	  try 
	  {
		xhttp = new ActiveXObject(activex_object_names[i]);
	  } 
	  catch (e) 
	  {
		xhttp = null;
	  }
		
	  if (xhttp)
	  {
		//caller.debug(F, "using #" + i + " " + activex_object_names[i]);
		break;
	  }
	}
	
	if (!xhttp && window.XMLHttpRequest)
	{
	  xhttp = new XMLHttpRequest();
	  //caller.debug(F, "using XMLHttpRequest");
	}

	if (!xhttp)
	{
	  throw "cannot find appropriate xhttp object";
	}
	else
	{
										// Detect for and call overrideMimeType('text/xml') before sending the request. 
										// This is a necessary step to address an issue in certain versions of Firefox. 
										// per http://www.javascriptkit.com/dhtmltutors/ajaxgetpost3.shtml
	  if (xhttp.overrideMimeType)
	  {
	    xhttp.overrideMimeType('text/xml')

		caller.debug(F, "overrideMimeType is now text/xml");
	  }
	}

	return xhttp;
} // end method

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

  var first_character = this.xhttp.responseText.substring(0, 1);
  
  //alert(F + ": content_type is \"" + content_type + "\" but first character is \"" + first_character + "\"");

  var response_jso;
   
                                        // Chrome says the content type is text/xml no matter what
                                        // eztask #11616: ajax error in Chrome complaining about no xml response
                                        // watchfrog #149
  if (content_type == "text/xml" &&
      first_character == "<")
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
	
  var text = this.xhttp.responseText;
                                        // sentinel for tracker text output found in response?
  var p = text.indexOf("\ntracker output:\n");
  if (p >= 0)
    text = text.substring(0, p);
    
  eval("var response_jso = " + text + ";"); 

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

