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


// this object represents a changewatcher which tracks talks ajax to a php server to watch for changes in files
// watchfrog #156

										// inherit the base methods and variables
dtack_changewatcher_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_changewatcher_c.prototype.parent = dtack_base2_c;

// --------------------------------------------------------------------

function dtack_changewatcher_c(dtack_environment, options)
{
  var F = "dtack_changewatcher_c";
										// initilialize the base instance variables
  this.construct(dtack_environment, F);

  this.dtphp_url = undefined;

  this.included_file_array = undefined;
  this.discovered_file_array = undefined;
  this.options = options;
  
  this.mappings = undefined;
  
  this.poll_count = 0;
  this.max_poll_count = 25;
  
  this.operation_mode = undefined;
} // end class

// -------------------------------------------------------------------------------

dtack_changewatcher_c.prototype.initialize = function()
{
  var F = "initialize";
                    
  var that = this;                           
	       
  this.host_changewatcher = undefined;
  try
  {
  	                                    // see of the host.js provides us with a configuration
  	this.host_changewatcher = host.changewatcher;
  	this.dtphp_url = dtphp_url;
  	this.included_file_array = dtphp__changewatcher__file_array;
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    message = "not initializing the changewatcher operations because " + message;
    
    this.debug(F, message); 
    return;                   
  }
  
  if (this.host_changewatcher.enabled != "yes")
  {
    this.debug(F, "not initializing the changewatcher operations because host.changewatcher.enabled is \"" + this.host_changewatcher.enabled + "\"");
    return;
  }
  
  
  
  	                                    // see of the host.js provides us with a list of url-to-directory mappings
  this.mappings = this.host_changewatcher.mappings;
  if (this.mappings == undefined)
      this.debug(F, "not discovering scripts or links from the DOM because host.js changewatcher mappings is undefined");

    this.show_and_start();
  
    $("DIV.dtack_changewatcher_container ._start").click(function(jquery_event_object) {that.poke_operation_mode("start"); return false;});
    $("DIV.dtack_changewatcher_container ._stop").click(function(jquery_event_object) {that.poke_operation_mode("stop"); return false;});
  
    $("DIV.dtack_changewatcher_container ._minimize_button").click(function(jquery_event_object) {that.poke_container_mode("minimized"); return false;});
    $("DIV.dtack_changewatcher_container ._normal_button").click(function(jquery_event_object) {that.poke_container_mode("normal"); return false;});
	       
} // end method

// -------------------------------------------------------------------------------

dtack_changewatcher_c.prototype.show_and_start = function()
{
  var F = "show_and_start";

  this.html = "<div class=\"dtack_changewatcher_container\">\n" +
    "<div class=\"_minimized\">" +
    "  <div class=\"_normal_button\"></div>\n" +
    "</div>\n" +
    "<div class=\"_normal\">" +
    "  <div class=\"_minimize_button\"></div>\n" +
    "  <div class=\"_title\">Change Watcher</div>\n" +
    "  <div class=\"_watching\">watching <span class=\"_count\"></span> files</div>\n" +
    "  <div class=\"_buttons\">\n" +
    "    <a href=\"#\" class=\"_button _stop\">stop</a>\n" +
    "    <a href=\"#\" class=\"_button _start\">start</a>\n" +
    "  </div>\n" +
    " <div class=\"_status\">instantiated</div>\n" +
    " <xmp class=\"_message\" style=\"display: none;\"></xmp>\n" +
    "</div>\n" +
    "</div>\n";
    
  $("BODY").append(this.html);
  $(".dtack_changewatcher_container").addClass("ui-corner-all");
  $(".dtack_changewatcher_container").draggable();
  
  this.compose_xml_request();

  this.poke_operation_mode("start");
  this.poke_container_mode("normal");
  
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.poke_operation_mode = function(operation_mode, status)
{
  this.operation_mode = operation_mode;
  
  switch(operation_mode)
  {
  	case "start":
      $("DIV.dtack_changewatcher_container ._start").hide();
      $("DIV.dtack_changewatcher_container ._stop").show();
                                        // start a new request to watch files
  
      this.update_status("first poll");
      this.poll_count = 0;
      this.submit_ajax_request();
  	break;
  	case "stop":
      $("DIV.dtack_changewatcher_container ._start").show();
      $("DIV.dtack_changewatcher_container ._stop").hide();
      if (this.last_sent_ajax_object != undefined)
      {
        this.last_sent_ajax_object.stop();
        if (status == undefined)
          status = "stopped";
        this.update_status(status);
	  }
  	break;
  }
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.poke_container_mode = function(container_mode)
{
  this.container_mode = container_mode;
  
  switch(container_mode)
  {
  	case "normal":
      $("DIV.dtack_changewatcher_container ._minimized").hide();
      $("DIV.dtack_changewatcher_container ._normal").show();
  	break;
  	case "minimized":
      $("DIV.dtack_changewatcher_container ._minimized").show();
      $("DIV.dtack_changewatcher_container ._normal").hide();
  	break;
  }
} // end method
// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.update_status = function(status)
{
  $("DIV.dtack_changewatcher_container ._status").html(status);
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.update_message = function(message)
{
  $("DIV.dtack_changewatcher_container ._message").html(message);
  $("DIV.dtack_changewatcher_container ._message").show();
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.compose_xml_request = function()
{
  var F = "compose_xml_request";           

  this.discovered_file_array = new Array();
  this.discovered_file_count = 0;
  
  for (var k in this.included_file_array)
  {
  	var file = this.included_file_array[k];
    this.discovered_file_array[file.name] = "X";     
  }                                                                        
                                        // we have a set of url-to-directory mappings?
  if (this.mappings != undefined)
  {
    this.discover_dom_scripts();
    this.discover_dom_links();
  }

  for (var filename in this.discovered_file_array)
  {
    this.included_file_array[this.included_file_array.length] = {"name": filename};
  }
  
  this.request_xml = "<request><watch><files>";
                                              
  var filename_array = new Array();
  var count = 0;
  
  for (var k in this.included_file_array)
  {
  	var file = this.included_file_array[k];
  	
  	if (file.name == undefined)
  	  continue;
  	                                    // we don't already have this file?
  	if (filename_array[file.name] == undefined)
  	{
      this.request_xml += "<file><name>" + file.name + "</name>";
      
      if (file.mtime != undefined)
      {
        this.request_xml += "<mtime>" + file.mtime + "</mtime>";
	  }

      this.request_xml += "</file>";
	  
	                                    // keep track of files we already have
      filename_array[file.name] = true;
  	  count++;
	}
  }
  
  this.request_xml += "</files></watch></request>";
  
  $("DIV.dtack_changewatcher_container ._count").html(count);
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.discover_dom_scripts = function()
{
  var F = "discover_dom_scripts";
  
  var scripts = document.scripts;
  var n = this.discovered_file_count;

  for(var k in scripts)
  {
    var url = scripts[k].src;
    
    if (url == undefined ||
        url == "")
      continue;
                                        // map url to filename and add to list of included files
    this.map_url_to_filename(url);

  }

  n = this.discovered_file_count - n;
  this.debug_verbose(F, "document has " + scripts.length + " scripts of which " + n + " are mapped");
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.discover_dom_links = function()
{
  var F = "discover_dom_links";
  
  var links = document.getElementsByTagName("LINK");
  var n = this.discovered_file_count;

  for(var k in links)
  {
    var url = links[k].href;
    
    if (url == undefined ||
        url == "")                                 
      continue;

                                        // map url to filename and add to list of included files
    this.map_url_to_filename(url);
    
                                        // reference the stylesheet in the link
    var stylesheet = links[k].sheet;
    
                                       // pull in the stylesheet imports
    this.discover_dom_stylesheet(stylesheet);
    
  }

  n = this.discovered_file_count - n;
  this.debug_verbose(F, "document has " + links.length + " links of which " + n + " are mapped");
  
} // end method


// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.discover_dom_stylesheet = function(stylesheet)
{
  var F = "discover_dom_stylesheet";
                                        // we aren't being given a stylesheet?
  if (stylesheet == undefined)
    return;
  
  var url = stylesheet.href;
                                        // the stylesheet has no href to a url?
  if (url == undefined)
    return;
                                        // map url to filename and add to list of included files
  this.map_url_to_filename(url);
  
  try
  {
                                        // reference the stylesheet's rules
    var rules = stylesheet.cssRules;
      
    for(var j in rules)
    {
  	                                    // rule is type 3 aka "@import"?
      if (rules[j].type == 3)
      {
        this.discover_dom_stylesheet(rules[j].styleSheet);
	  }
  
    }
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    message = "exception accessing stylesheet with url " + this.vts(url) + ": " + message;
    
    this.debug(F, message); 
    return;                   
  }
} // end method

// ----------------------------------------------------------------------------

dtack_changewatcher_c.prototype.map_url_to_filename = function(url)
{
  var F = "map_url_to_filename";

                                        // we have no set of url-to-directory this.mappings?
  if (this.mappings == undefined)
    return;
                     
  for(var from in this.mappings)
  {
    if (url.length < from.length)
      continue;
      
    if (url.substr(0, from.length) == from)
	{
	  var filename = this.mappings[from] + url.substr(from.length);
	  
	  if (this.discovered_file_array[filename] === undefined)
	  {
	    this.debug(F, "mapping discovered url from " + url + " to " + filename);
	    this.discovered_file_array[filename] = "Y";
	    this.discovered_file_count++;
	  }
	  else
	  {
	    //this.debug(F, "not mapping previously discovered file " + filename + " value " + this.discovered_file_array[filename]);
	  }
	  
	  return;
	}
  }
  
  this.debug_verbose(F, "not mapping link from " + url);

} // end method

// ----------------------------------------------------------------------------
// submit ajax request

dtack_changewatcher_c.prototype.submit_ajax_request = function()
{
  this.poll_count++;
  
  if (this.poll_count > this.max_poll_count)
  {
  	this.poke_operation_mode("stop");
  	this.update_status("poll count exceeded max " + this.max_poll_count);
  	return;
  }

  var that = this;
                                        // instantiate a new ajax object
  var ajax_object = new dtack_ajax2_c(dtack_environment);
  
                                        // specify the handler to be called when the request finishes
  ajax_object.attach_trigger(
    "finished", 
    function(triggered_object)
    {
	  that.handle_ajax_finished(triggered_object);
	});

                                        // post the xml from the textarea to the url specified in the text box
  ajax_object.post(
    this.dtphp_url + "/demands/changewatcher_loop.php", 
    "request=" + this.request_xml);
    
  this.last_sent_ajax_object = ajax_object;
  
} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_changewatcher_c.prototype.handle_ajax_finished = function(ajax_object)
{
                                        // stuff the raw values into the display
  this.update_status("ajax finished with code: " + ajax_object.http_code);
  
  if (this.operation_mode == "stop")
  {
    this.update_status("stopped");
  }
  else
  if (parseInt(ajax_object.http_code, 10) == 0)
  {
  	this.update_status("page is unloading");
  }
  else
  if (parseInt(ajax_object.http_code, 10) == 200)
  {
  	if (ajax_object.http_body.indexOf("files_have_changed") >= 0)
	{
      this.update_status("files have changed at poll count " + this.poll_count + ", reloading");
      
      location.reload(true);
	}
	else
  	if (ajax_object.http_body.indexOf("another_connect_started") >= 0)
	{
      this.poke_operation_mode("stop", "another page now using server");
	}
	else
  	{
      this.update_status("poll count " + this.poll_count + ", trying again");
  
                                        // start a new request to watch files
      this.submit_ajax_request();
	}
  }
  else
  {
    this.update_message(this.dtack_environment.escape_html(ajax_object.http_body));
  }
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// -------------------------------------------------------------------------------

dtack_changewatcher_c.prototype.debug_verbose = function(F, message)
{
  //this.debug(F, message);
} // end method

                 