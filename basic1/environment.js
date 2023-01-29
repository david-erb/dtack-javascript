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

// file version 2009-12-06A

// the environment regulates the interaction between the objects and the environment they are in
// the environment implemented by this implementation is a standard web page
// debug messages are added to the div named debug_message
// state messages overwrite the div named state_message
// errors are brought to the operator's attention by alerts

var dtack_environment_instance_number = 0;

// --------------------------------------------------------------------
function dtack_environment_c()
{
  if (dtack_environment_instance_number != 0)
    alert("instantating dtack_environment #" + dtack_environment_instance_number);
    
  this.debug_level = 0;

  this.debug_string = "";

  this.dtack_environment_debug_message_element = null;
  this.dtack_environment_state_message_element = null;

  this.is_ie = navigator.appName == "Microsoft Internet Explorer";

  this.includes = new Array();

  this.cgis = new Array();
										/* general purpose environment settings */
										// watchfrog #16
  this.settings = new Array();

										/* list of outstanding doreq requests */
										// watchfrog #58
  this.doreq_objects = new Object();

										/* initialize the doreq unique id for doreq objects */
  this.doreq_id = 0;

  this.instance_number = ++dtack_environment_instance_number;

                                        // create a window instance name for the environment
                                        // watchfrog #122
  this.window_instance_name = window.name;

  if (this.window_instance_name == undefined ||
      this.window_instance_name == null ||
      this.window_instance_name =="")
  {
  	var splits = location.pathname.split("/");
  	this.window_instance_name =  splits[splits.length-2] + "/" + splits[splits.length-1];
  }

  this.debug_start_milliseconds = (new Date()).getTime();
  this.debug_since_milliseconds = this.debug_start_milliseconds;
  
  this.symbols = new Array();
  
  // --------------------------------------------------------------------
  // watchfrog #58

  this.doreq_register = function(doreq_object)
  {
	var F = "doreq_register";
										/* increment the unique id */
	this.doreq_id++;
										/* let the object remember its id */
	doreq_object.doreq_id = this.doreq_id;

										/* keep a reference to the object in our list */
	this.doreq_objects[this.doreq_id] = doreq_object;

  } // end method

  // --------------------------------------------------------------------
  // watchfrog #58

  this.doreq_returned = function(returned_object)
  {
	var F = "doreq_returned";

										// don't steal the error
										// watchfrog #28
	if (returned_object.doreq_id == undefined)
	{
	  this.debug(F, "no doreq_id in response");
	}
	else
	if (this.doreq_objects[returned_object.doreq_id] == undefined)
	{
	  this.debug(F, "unknown doreq_id in response: \"" + returned_object.doreq_id + "\"");
	}
	else
	{
	  this.doreq_objects[returned_object.doreq_id].returned(returned_object);

	  this.doreq_objects[returned_object.doreq_id] = undefined;
	}

  } // end method

  // --------------------------------------------------------------------
  this.okbox = function(F, message)
  {
	alert(F + ": " + message);
  } // end method

  // -------------------------------------------------------------------
  this.error = function(F, message)
  {
	this.okbox(F, message);
  } // end method

  // -------------------------------------------------------------------
  this.assert = function(F, message, truth)
  {
	if (!truth)
	{
										/* show the error (for now, until we know how to catch outer exceptions!) */
	  this.error(F, message);
										/* throw an error to stop execution */
	  throw F + ": " + message;
	}
  } // end method

  // -------------------------------------------------------------------
  // the caller who is a page usually uses doreq instead of calling this directly

  this.attach_debug_window = function(window_url, window_name)
  {
  	var F = "attach_debug_window";

  	this.debug_window = window.open(window_url, window_name);

  } // end method

  // -------------------------------------------------------------------
  // this is called by the remote debug window when it is ready

  this.attached_debug_window = function(window)
  {
  	var F = "attached_debug_window";

    if (window)
      this.debug_window = window;

    var message = undefined;
    var method = undefined;

    if (this.debug_window)
    {
      this.debug_window_document = this.debug_window.document;

      if (this.debug_window_document)
      {
      	if (this.debug_window.dtack_environment)
        {
      	  if (this.debug_window.dtack_environment.debug)
          {

                                        // passthrough debug to remote window based on parent if given
                                        // watchfrog #123
            if (this.debug_window.dtack_environment.debug_window &&
                this.debug_window.dtack_environment.debug_window_dtack_environment)
            {
              this.debug_window_dtack_environment = this.debug_window.dtack_environment.debug_window_dtack_environment;
              this.debug_window = this.debug_window.dtack_environment.debug_window;
              message = "this.debug_window_document.dtack_environment.debug is there and subsidiary with window_opened " +
                this.debug_window.dtack_environment.window_opened;
            }
            else
            {
              this.debug_window_dtack_environment = this.debug_window.dtack_environment;
              message = "this.debug_window_document.dtack_environment.debug is there and self-owned with window_opened " +
                this.debug_window.dtack_environment.window_opened;
            }
                                        // if we pick up a debug window, then adopt its window_opened as well
                                        // this is so any iframes we launch (who see us as the opener)
                                        // will use the same debug window
                                        // watchfrog #134
            this.window_opened = this.debug_window_dtack_environment;

          }
          else
          {
            message = "this.debug_window_document.dtack_environment.debug is not there";
          }
        }
        else
        {
          message = "this.debug_window_document.dtack_environment is not there";
        }

      }
      else
      {
        message = "this.debug_window_node.document is not a node";
      }
    }
    else
    {
      message = "window.open did not return a node";
    }

    //alert(location.href + " dtack_environment::attached_debug_window: " + message);
  } // end method

  // -------------------------------------------------------------------
  this.compose_debug_message_as_text = function(F, message)
  {

    var now_milliseconds = (new Date()).getTime();
    var start_milliseconds =  now_milliseconds - this.debug_start_milliseconds;
    var since_milliseconds =  now_milliseconds - this.debug_since_milliseconds;
    this.debug_since_milliseconds = now_milliseconds;

    var profile_milliseconds = start_milliseconds + " " + since_milliseconds + " ";

    return profile_milliseconds + (this.instance_serial_number? this.instance_serial_number + "|": "") + F + ": " + message;
  } // end method

  // -------------------------------------------------------------------
  this.compose_debug_message_as_html = function(F, message)
  {
    var now_milliseconds = (new Date()).getTime();
    var start_milliseconds =  now_milliseconds - this.debug_start_milliseconds;
    var since_milliseconds =  now_milliseconds - this.debug_since_milliseconds;
    this.debug_since_milliseconds = now_milliseconds;

	return "<div class=\"T_line\">" +
	  "<div class=\"start_milliseconds\">" + start_milliseconds + "</div> " +
	  "<div class=\"since_milliseconds\">" + since_milliseconds + "</div> " +
	  "<div class=\"location\">" + F + ":</div> " +
	  "<div class=\"message\">" + message + "</div>" +
	  "</div>";

  } // end method

  // -------------------------------------------------------------------
  // watchfrog #21

  this.debug_count = 0;

  this.debug = function(F, message)
  {
	if (this.debug_level == 0)
    {
	  return;

    }

    if (this.host_debug_destination === undefined)
    {
      this.host_debug_destination = this.host_value("debug.destination", "dtack_environment_debug_message");
	}

    if (this.host_debug_destination === "javascript_console")
    {
      console.log(this.compose_debug_message_as_text(F, message));
      return;
	}
	
                                        // there is dashboard_protocol=3 on the url line or host settings?
    if (this.cgis &&
        this.cgis.dashboard_protocol == "3" ||
                                        // added to allow dashboard protocol to be specified in host.js 
        this.host_value("dashboard_connection.protocol", undefined) === "3")
    {
                                        // this is not a "clear debug panel" message?
                                        // don't send the undefined parameters to C# because they arrive as System.DBNull
      if (F != undefined &&
          message != undefined)
      {
                                        // send the message through the c# debug routine
                                        // watchfrog #128
        window.external.debug_javascript(F, message);
      }
      return;
    }





                                        // we have a remote debug window to talk to?
                                        // watchfrog #119
	if (this.debug_window_dtack_environment)
	{
                                        // use the window instance name if doing remote debug
                                        // watchfrog #124
	  this.debug_window_dtack_environment.debug((this.window_instance_name? this.window_instance_name + "|": "") + F, message);
	  return;
	}
										/* we don't know the message element yet? */
	if (!this.dtack_environment_debug_message_element)
	{
										/* find the message element in the DOM */
	  this.dtack_environment_debug_message_element =
	    this.element("dtack_environment_debug_message");     
	}


	if (this.dtack_environment_debug_message_element)
	{

	  if (message == null)
	  {
	    this.debug_string = "";
        if (this.host_debug_destination === "$dtack_environment_debug_message")
        {
          if (this.$dtack_environment_debug_message)
            $(".T_line", this.$dtack_environment_debug_message).remove();
		}
	  }
	  else
	  {
        //F = this.instance_number + "! " + F;

		var now_milliseconds = (new Date()).getTime();
		var start_milliseconds =  now_milliseconds - this.debug_start_milliseconds;
		var since_milliseconds =  now_milliseconds - this.debug_since_milliseconds;
		this.debug_since_milliseconds = now_milliseconds;

        if (this.host_debug_destination === "$dtack_environment_debug_message")
        {
          if (this.$dtack_environment_debug_message === undefined)
          {
          	this.$dtack_environment_debug_message = $("#dtack_environment_debug_message");
  		    
  		    this.$dtack_environment_debug_message.append("<div><a href=\"#\" onclick=\"return dtack_environment.debug(null) && false\">CLEAR</a></div>");
		  }
		  
		  var html = this.compose_debug_message_as_html(F, message);
          this.$dtack_environment_debug_message.append(html);
		}
		else
		
										// handle xmp tag differently
										// watchfrog #45
		if (this.dtack_environment_debug_message_element.tagName == "XMP")
		{
		  if (this.debug_string != "")
		      this.debug_string += "\n"

		                                // add elapsed timing to javascript html debug (light blue stuff)
		                                // watchfrog #151
		  var profile_milliseconds = start_milliseconds + " " + since_milliseconds + " ";

		  this.debug_string += profile_milliseconds + (this.instance_serial_number? this.instance_serial_number + "|": "") + F + ": " + message;
		}
		else
		{
		  if (this.debug_string != "")
		      this.debug_string += "<br>";

		  if (this.is_ie)
		    message = message.replace(/[<]/, "&lt;");
		  else
		    message = message.replace(/[<]/, "&lt;");

		                                // add elapsed timing to javascript html debug (light blue stuff)
		                                // watchfrog #151
		  this.debug_string += 
		    "<div class=\"start_milliseconds\">" + start_milliseconds + "</div> " +
		    "<div class=\"since_milliseconds\">" + since_milliseconds + "</div> " +
		    "<div class=\"location\">" + F + ":</div> " +
		    "<div class=\"message\">" + message + "</div>";
		}
	  }

      if (this.host_debug_destination === "$dtack_environment_debug_message")
      {
	  }
	  else
	  if (this.dtack_environment_debug_message_element.tagName == "XMP")
	  {
		if (this.is_ie)
		{
		  this.dtack_environment_debug_message_element.innerText = this.debug_string;
		}
		else
		{
		  this.dtack_environment_debug_message_element.textContent = this.debug_string;
		}
	  }
	  else
	  {
										// went back to innerHTML instead of textContent
										// watchfrog #22
		this.dtack_environment_debug_message_element.innerHTML = this.debug_string;
	  }
	}

  } // end method

  // -------------------------------------------------------------------
  this.poke_debug_level = function(debug_level)
  {
    var F = "poke_debug_level";

	this.debug_level = debug_level;

	//alert("<" + this.window_instance_name + "> " + F + "#" + this.instance_number + ": " + debug_level);

    if (!this.dtack_environment_debug_message_element)
	  this.dtack_environment_debug_message_element =
	    this.element("dtack_environment_debug_message");   
	if (!this.dtack_environment_state_message_element)
	  this.dtack_environment_state_message_element =
	    this.element("dtack_environment_state_message");

	var display;
	if (this.debug_level == 0)
	{
	  display = "none";
	}
	else
	{
	  display = "block";
      this.debug(F, null);
	}

	if (this.dtack_environment_debug_message_element)
	{
	  this.dtack_environment_debug_message_element.style.display = display;
	  this.use_text_content = this.dtack_environment_debug_message_element.textContent;
	}


	if (this.dtack_environment_state_message_element)
	{
	  this.dtack_environment_state_message_element.style.display = display;
	}

  } // end method

  // -------------------------------------------------------------------
  this.state = function(message)
  {
										/* we don't know the message element yet? */
	if (!this.dtack_environment_state_message_element)
	{
										/* find the message element in the DOM */
	  this.dtack_environment_state_message_element =
	    this.element("dtack_environment_state_message");
	}

	if (this.dtack_environment_state_message_element)
	{
	  this.dtack_environment_state_message_element.innerText = message;
	}
  } // end method

  // -------------------------------------------------------------------
  this.element = function(id)
  {
	return document.getElementById? document.getElementById(id): document.all? document.all[id]: null;
  } // end method

  // -------------------------------------------------------------------
  // watchfrog #15

  this.need_element = function(F, id)
  {
	var element = this.element(id);

	if (!element)
	{
	  this.error(F, "could not find element " + id);
	}

	return element;
  } // end method

  // -------------------------------------------------------------------
  this.want_element = function(F, id)
  {
	var element = this.element(id);

	if (!element)
	  this.debug(F, "could not find element " + id);

	return element;
  } // end method

  // -------------------------------------------------------------------
  this.sub_element = function(container, id)
  {
	return container.getElementById? container.getElementById(id): container.all? container.all[id]: null;
  } // end method

  // -------------------------------------------------------------------
  this.want_sub_element = function(F, container, id)
  {
	var element = this.sub_element(container, id);

	if (!element)
	  this.debug(F, "could not find sub_element " + id + " in " + container.id);

	return element;
  } // end method

  // -------------------------------------------------------------------
  this.formfield = function(name, options)
  {
  	var not_form_name = this.option_value(options, "not_form_name", undefined);
  	
	var forms = document.forms;
	if (forms)
	{
	  var nforms = document.forms.length;
	  var iform;
	  for (iform=0; iform<nforms; iform++)
	  {
	  	if (not_form_name != undefined &&
	  	    document.forms[iform].name == not_form_name)
	  	  continue;
	  	  
		var fields = document.forms[iform].elements;
		var nfields = fields.length;
		var ifield;
		for(ifield=0; ifield<nfields; ifield++)
		{
		  if (fields[ifield].name == name)
		  {
			return document.forms[iform].elements[ifield];
		  }
		}
	  }
	}

	return null;
  } // end method

  // -------------------------------------------------------------------
  this.want_formfield = function(F, name)
  {
	var formfield = this.formfield(name);

	if (!formfield)
	  this.debug(F, "could not find formfield " + name);

	return formfield;
  } // end method

  // -------------------------------------------------------------------
  this.want_element_with_tagname = function(F, id, tagname)
  {
	var element = this.want_element(F, id);

	if (element && element.tagName.toUpperCase() != tagname.toUpperCase())
	{
	  this.debug(F, "element " + id +
	    " is a " + element.tagName.toUpperCase() +
		" not a " + tagname.toUpperCase());

	  return null;
	}
	else
	  return element;
  } // end method

// -------------------------------------------------------------------
// http://www.permadi.com/tutorial/flashjscommand/index.html
  this.want_flash = function(F, name)
  {
	if (window.document[name])
	{
	  return window.document[name];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1)
	{
	  if (document.embeds && document.embeds[name])
		return document.embeds[name];
	}
	else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
	{
	  return this.want_element(F, name)
	}
  }

  // -------------------------------------------------------------------------------

  this.option_value = function(
    options,
    option,
    default_value)
  {
  	                                    // use type-specific comparisons in options value determination
  	                                    // watchfrog #186
    if (options === undefined ||
        options === null ||
        options === "")
      return default_value;

    if (options[option] === undefined)
      return default_value;
      
    return options[option];

  } // end method

  // -------------------------------------------------------
  
  this.is_affirmative_option = function(options, option)
  {
  	return this.is_affirmative_value(this.option_value(options, option, null));
  }  // end method
  
  
  // -------------------------------------------------------
  
  this.is_affirmative_value = function(value)
  {
    if (value === null)
      return false;
    if (value === undefined)
      return false;
    if (value.toLowerCase() === "true")
      return true;
    if (value.toLowerCase() === "yes")
      return true;
    if (value.toLowerCase() === "on")
      return true;
    if (value === "1")
      return true;
    if (value === 1)
      return true;
    if (value === true)
      return true;
    return false;
  }  // end method

  
  // -------------------------------------------------------------------------------

  this.option_section_value = function(
    options,
    section_name,
    option,
    default_value)
  {
  	                                    // use type-specific comparisons in options value determination
  	                                    // watchfrog #186
    if (options === undefined ||
        options === null ||
        options === "")
      return default_value;

    var section = options[section_name];
    
    if (section === undefined ||
        section === null ||
        section === "")
      return default_value;
    
    if (section[option] === undefined)
      return default_value;
      
    return section[option];

  } // end method

  // -------------------------------------------------------------------
  this.parse_cgi = function(location)
  {
	var F = "parse_cgi";

	var cgis = new Array();

	var t = location.search.substring(1, location.search.length);

	if (t.length == 0)
	  return cgis;
										/* replace plus signs with spaces */
	t = t.replace(/\+/g, " ");

										/* break up into individual key=value pairs */
	var args = t.split("&");

										/* for each key=value pair */
	for (var i=0; i<args.length; i++)
	{
										/* find the equals sign */
	  var p = args[i].indexOf("=");

	  var k = "";
	  var v = "";
										/* no equals sign? */
	  if (p == -1)
	  {
										/* presume keyword with a blank value */
		k = args[i];
	  }
	  else
										/* equals sign not first character? */
	  if (p > 0)
	  {
										/* separate the keyword from the value */
		k = args[i].substr(0, p);
		if (p < args[i].length + 1)
		  v = args[i].substr(p+1);
	  }

	  if (k != "")
	  {
		k = decodeURIComponent(k);
		k = k.replace(/^\s+|\s+$/, "");

		v = decodeURIComponent(v);
		v = v.replace(/^\s+|\s+$/, "");

		//		dtack_environment.debug(F, "cgis[" + k + "] = \"" + v + "\"");
		cgis[k] = v;
	  }
	}

	return cgis;
  } // end method

  // -------------------------------------------------------------------------------
  // remember that the loading of the include file happens on its own thread
  // so it won't necessarily be loaded before this function returns

  this.include = function(url)
  {
	var F = "include";

	this.debug(F, "including " + url);

	var head = document.getElementsByTagName("head")[0];

	var script = document.createElement("script");
	script.src = url;
	script.type = "text/javascript";

	head.appendChild(script);

	if (this.includes[url] == undefined)
	  this.includes[url] = {count: 1};
	else
	  this.includes[url].count++;
  } // end method

  // -------------------------------------------------------------------------------
  this.include_once = function(url)
  {
	var F = "include_once";

	if (this.includes[url] == undefined)
	{
	  this.include(url);
	}
	else
	{
	  this.debug(F, "not re-including " + url);
	}
  } // end method

  // -----------------------------------------------------------------------------------
  // blinking functions
  // watchfrog #39

  this.blink_start = function(id)
  {
	var F = "blink_start";

	var node = this.element(id);

	if (!node)
	  return;

	if (this.blinking_objects == undefined)
	{
	  this.blinking_objects = new Object();
	}

	if (this.blinking_objects[id] != undefined)
	{
	  this.blink_cease(id);
	}

	var blinking_object = {
	  "id": id,
	  "node": node,
	  "classname": node.className,
	  "classname_blink": node.className + "_blink",
	  "blinked": false,
	  "timer": undefined
	}

	this.blinking_objects[id] = blinking_object;

	this.blink_blink(id);

	blinking_object.timer = setInterval("dtack_environment.blink_blink(\"" + id + "\")", 250);

	//this.debug(F, "starting blink on " + id);
  } // end method

  // -----------------------------------------------------------------------------------

  this.blink_cease = function(id)
  {
	var F = "blink_cease";

	if (this.blinking_objects == undefined)
	  return;

	if (this.blinking_objects[id] == undefined)
	  return;

	var blinking_object = this.blinking_objects[id];

	if (blinking_object.timer != undefined)
    {
  	  clearInterval(blinking_object.timer);

	  blinking_object.timer = undefined;
    }

                                        // reset blinking object to non-blinked css state
                                        // after the timer is stopped
                                        // watchfrog #139
    blinking_object.node.className = blinking_object.classname;

	blinking_object.blinked = false;
  } // end method

  // -----------------------------------------------------------------------------------

  this.blink_blink = function(id)
  {
	var F = "blink_blink";

	if (this.blinking_objects == undefined)
	  return;

	if (this.blinking_objects[id] == undefined)
	  return;

	var blinking_object = this.blinking_objects[id];

	if (blinking_object.blinked)
	{
	  blinking_object.node.className = blinking_object.classname;
	  //this.debug(F, "blink on " + id + " " + blinking_object.className);
	}
	else
	{
	  blinking_object.node.className = blinking_object.classname_blink;
	  //this.debug(F, "blink off " + id + " " + blinking_object.className);
	}

	blinking_object.blinked ^= 1;
  } // end method

  // ------------------------------------------------------------------
  //
  this.escape_html = function(s)
  {
    if (s == undefined)
      return s;

    return s.
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;");

//      replace(/'/g, "&apos;").
//      replace(/"/g, "&quot;").
//      replace(/&/g, "&amp;");
  } // end method

  // ------------------------------------------------------------------
  //
  this.escape_xml = function(s)
  {
    if (s == undefined)
      return s;

    return s.
      replace(/&/g, "&amp;").
      replace(/</g, "&lt;").
      replace(/>/g, "&gt;") .
      replace(/'/g, "&apos;").
      replace(/"/g, "&quot;");
  } // end method

  // ------------------------------------------------------------------
  // watchfrog #129

  this.initialize_dtack_document_callback_handle = function()
  {
    var element = this.element("dtack_document_callback_handle");

                                        // body of html contains a div or span to hold the handle?
    if (element)
    {
      var date = new Date();
      var document_callback_handle = date.getTime();
                                        // hopefully for now, the milliseconds will distinguish this document from all others
                                        // later look at cgi's for this if the iframe manager is able to put them on?
      element.innerHTML = document_callback_handle;

      //alert("setting dtack_document_callback_handle to " + document_callback_handle);
    }
    else
    {
      //alert("no dtack_document_callback_handle");
    }
  } // end method

  // ------------------------------------------------------------------
  // watchfrog #129

  this.peek_dtack_document_callback_handle = function()
  {
    var element = this.element("dtack_document_callback_handle");

                                        // body of html contains a div or span to hold the handle?
    if (element)
    {
      return element.innerHTML;

      //alert("setting dtack_document_callback_handle to " + document_callback_handle);
    }
    else
    {
      return undefined;
      //alert("no dtack_document_callback_handle");
    }
  } // end method


  // ------------------------------------------------------------------
  // watchfrog #141

  this.host_value = function(dotted_keyword, default_value)
  {
    var value = undefined;
    try
    {
      eval("value = this.settings.host." + dotted_keyword + ";");
    }
    catch(exception)
    {
      value = undefined;
    }

    if (value == undefined)
      value = default_value;

    return value;
  } // end method

  // ------------------------------------------------------------------
  // watchfrog #141

  this.host_require = function(dotted_keyword)
  {
    var value = undefined;
    try
    {
      eval("value = this.settings.host." + dotted_keyword + ";");
    }
    catch(exception)
    {
      value = undefined;
    }

    if (value == undefined)
      alert("host.js file does not contain setting for " + dotted_keyword);

    return value;
  } // end method

  // ------------------------------------------------------------------
  // watchfrog #141
  // allow dotted keyword hierarchy to self-instantiate
  // watchfrog #191

  this.host_set = function(dotted_keyword, value)
  {
  	
    try
    {
      var parts = dotted_keyword.split(".");
      
      var o = this.settings.host;
      for (var k in parts)
      {
      	var part = parts[k];
      	if (k == parts.length - 1)
      	{
      	  o[part] = value;
		}
		else
		{
      	  if (o[part] === undefined)
      	  {
      	    o[part] = new Object();
		  }
		  o = o[part];
		}
	  }

      //eval("this.settings.host." + dotted_keyword + " = value;");
    }
    catch(exception)
    {
      alert("unable to assign value to this.settings.host." + dotted_keyword);
    }
  } // end method

  // ------------------------------------------------------------------
  // get settings.host from global host variable, or default

  this.assign_settings_host = function(default_value)
  {
    this.settings.host = undefined;
    try
    {
      this.settings.host = host;
    }
    catch(exception)
    {
      this.settings.host = default_value;       
    }
  } // end method
             


  // -------------------------------------------------------------------------------
  // watchfrog #185
  this.define_symbol = function(symbol_name, symbol_value)
  {
     this.symbols[symbol_name] = symbol_value;
     
//     alert("defining " + symbol_name + 
//        "\n\nlength now " + this.symbols.length +
//        "\n\nvalue now " + this.symbols[symbol_name]);
  } // end method

  // -------------------------------------------------------------------------------
  this.resolve_symbol = function(symbol_name, default_symbol_value)
  {

    if (default_symbol_value === undefined ||
        default_symbol_value === null)
      default_symbol_value = symbol_name;
      
    var resolved_value = this.option_value(this.symbols, symbol_name, default_symbol_value);

//    alert("resolving " + symbol_name + 
//      "\n\nlength now " + this.symbols.length +
//      "\n\ndirect value " + this.symbols[symbol_name] +
//      "\n\nresolved value " + resolved_value);
    
    return resolved_value;
  } // end method

  // -------------------------------------------------------------------------------
  this.require_symbol = function(symbol_name)
  {
    var resolved_value = this.option_value(this.symbols, symbol_name, undefined);
    
    if (resolved_value === undefined)
      throw "cannot resolve symbol \"" + symbol_name + "\"";
      
    return resolved_value;
  } // end method

  // -------------------------------------------------------------------------------
  this.require_nonblank_symbol = function(symbol_name)
  {
    var resolved_value = this.option_value(this.symbols, symbol_name, undefined);
    
    if (resolved_value === undefined)
      throw "symbol \"" + symbol_name + "\" is undefined";
    
    if (resolved_value === null)
      throw "symbol \"" + symbol_name + "\" is null";
    
    if (resolved_value === "")
      throw "symbol \"" + symbol_name + "\" is blank";
    
    if (resolved_value.replace(/^\s+|\s+$/gm,'') === "")
      throw "symbol \"" + symbol_name + "\" is trimmed blank";
      
    return resolved_value;
  } // end method
                                                               
  // -------------------------------------------------------------------------------
  this.trim = function(value)
  {
  	if (value === undefined)
  	  return "";
  	  
  	if (value === null)
  	  return "";
  	  
    value += "";
  	  
    return value.replace(/^\s+|\s+$/gm, "");
  } // end method
  
  // -------------------------------------------------------------------------------
  this.starts_with = function(string, prefix)
  {
  	if (string === null ||
  	    string === undefined ||
  	    string === "" ||
  	    prefix === null ||
  	    prefix === undefined ||
  	    prefix === "")
    {
  	  return false;
	}                         
	
	return string.substring(0, prefix.length) === prefix;
  } // end method
 
  // -------------------------------------------------------------------------------
  this.ends_with = function(string, suffix)
  {
  	if (string === null ||
  	    string === undefined ||
  	    string === "" ||
  	    suffix === null ||
  	    suffix === undefined ||
  	    suffix === "")
    {
  	  return false;
	}                         
	
	return string.substring(string.length-suffix.length) === suffix;
  } // end method
 
// ---------------------------------------------------------
} // end class

