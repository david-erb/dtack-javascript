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

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_ajax2_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_ajax2_c.prototype.parent = dtack_base2_c;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// --------------------------------------------------------------------
// watchfrog #105

function dtack_ajax2_c(dtack_environment, options)
{
  var F = "dtack_ajax2_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  this.xhttp = null;

  this.options = options;
  
} // end class

// -------------------------------------------------------------------------------
// post something to the server

dtack_ajax2_c.prototype.post = function(url, data)
{
  var F = "post";


  this.http_status = undefined;

  this.xhttp = this.find_xhttp();

  this.url = url;
										//prepare the call, http method, url, true=asynchronous call
  this.xhttp.open("POST", url, true);

                                        // watchfrog #105
  if (this.options && this.options.content_type)
  {
    this.xhttp.setRequestHeader("Content-Type", this.options.content_type);
  }
  else
  {
    this.xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }

										// hook the event handler
  var that = this;
  this.xhttp.onreadystatechange = function()
  {
	if (that.xhttp.readyState == 2)
	{
	  that.pull_triggers("headers", that);
	}
	else
	if (that.xhttp.readyState == 4)
	{
	  that.http_code = that.xhttp.status;
	  that.http_body = that.xhttp.responseText;

	  that.pull_triggers("finished", that);
	}
  }

  this.pull_triggers("sending", this);
	
										// finally send the data
  this.xhttp.send(data); 
	
} // end method

// -------------------------------------------------------------------------------
// stop ongoing request

dtack_ajax2_c.prototype.stop = function()
{
  var F = "stop";

  this.xhttp.abort(); 
											/* release the underlying engine instance */
  this.xhttp = null;

} // end method

// -------------------------------------------------------------------------------

dtack_ajax2_c.prototype.find_xhttp = function() 
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
		break;
	  }
	}
	
	if (!xhttp && window.XMLHttpRequest)
	{
	  xhttp = new XMLHttpRequest();
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
	  }
	}

	return xhttp;
} // end method


// -------------------------------------------------------------------------------
// caller is finished with this transaction

dtack_ajax2_c.prototype.finished = function()
{
  var F = "finished";
										/* release the underlying engine instance */
  this.xhttp = null;
  
} // end method
