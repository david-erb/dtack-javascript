// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack_page_base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_page_base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_page_base_c.prototype.constructor = dtack_page_base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_page_base_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_page_base_c";

										/* call the base class constructor helper */
	dtack_page_base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                                        // push the class hierarchy so debug_verbose may be used
	this.push_class_hierarchy(F);
  }

  this.dashboard_connection = null;
  
  this.ignore_clicks = 0;

  this.herenow_node = undefined;

                                        // object which watches for page changes
  this.changewatcher = undefined;

                                        // object which watches for idle timeout
  this.idlewatcher = undefined;

                                        // object which manages scrollable elements
  this.scrollables = undefined;

                                        // object which manages interaction with a popup dialog
  this.miniwindow_dialog = undefined;
  
  this.posted_change_list = {};
  this.posted_change_list_count = 0;  

  this.CONSTANTS = {};
  this.CONSTANTS.DEMAND_COMMANDS = {};

  this.CONSTANTS.FORM_NAMES = {};
  this.CONSTANTS.FORM_NAMES.NAVIGATION = "navigation_form";
  this.CONSTANTS.EVENTS = {};
  this.CONSTANTS.EVENTS.SEND_FORM_BY_DASHBOARD_CONNECTION = "dtack_page_base_c::SEND_FORM_BY_DASHBOARD_CONNECTION";
  
  this.POSTED_CHANGE_ACTION_CHANGED = "changed";
  this.POSTED_CHANGE_ACTION_AJAX_EXPECTED = "ajax_expected";
  this.POSTED_CHANGE_ACTION_AJAX_STARTED = "ajax_started";
  this.POSTED_CHANGE_ACTION_AJAX_SUCCEEDED = "ajax_succeeded";
  this.POSTED_CHANGE_ACTION_AJAX_FAILED = "ajax_failed";
  
  this.POSTED_SCROLL_FIELD_NAME = "posted_scroll";
  this.CRUMB_AUTOID_FIELD_NAME = "crumb_autoid";
  this.CRUMB_SCROLL_FIELD_NAME = "crumb_scroll";
  
  this.POSTED_PROCESSING_CONFIRMATION_FIELD_NAME = "posted_processing_confirmation";
  
  this.TRIGGER_EVENTS = 
  {
  	WINDOW_RESIZED: "WINDOW_RESIZED"
  }
  
  this.max_wait_for_unfinished_ajax_milliseconds = 2000;
  this.this_wait_for_unfinished_ajax_milliseconds = 0;

                                        // removed tied_records_non_ajax_collection 
                                        // since there are methods in other classes accessing this is a public instance variable
                                        // eztask #15808 Flood trunk not working for add-another address in 2-applicant/10-bucket/application
  this.tied_records_collection = new Array();
  
} // end constructor


// -------------------------------------------------------------------------------
// this can be called in the head, possibly before any dom elements are loaded

dtack_page_base_c.prototype.initialize = function(options)
{
  var F = "dtack_page_base_c::initialize";

                                        // watchfrog #159
  this.debug_verbose(F, "initializing the dtack page base " + this.option_keys_text(options));

  this.initialize_changewatcher(options);
  
                                        // initialize object which looks for idle time and warns and logs off
                                        // watchfrog #173
  this.initialize_idlewatcher(options);
  
                                        // initialize object which manages scrollable elements
                                        // watchfrog #177
  this.initialize_scrollables(options);
                                                             
                                        // initialize object which handles interactive dyemarkers
  this.initialize_dyemarker(options);

                                        // initialize page-wide keystroke handling
  this.initialize_keys();
  
  this.initialize_miniwindow_dialog();
} // end method


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.initialize_dyemarker = function(options)
{
  var F = "dtack_page_base_c::initialize_dyemarker";
  try
  {
    this.dyemarker_buttons = new dtack__dyemarkers__buttons_c(this);
    //this.dyemarker_buttons.should_debug_verbose = "yes";
    this.dyemarker_buttons.initialize();
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't start the dyemarker_buttons because " + exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    this.debug(F, message);
  }
} // end method

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.initialize_changewatcher = function(options)
{
  var F = "dtack_page_base_c::initialize_changewatcher";

                                        // fail gracefully if changewatcher class include file is missing
                                        // watchfrog #156
  try
  {
  	this.changewatcher = new dtack_changewatcher_c(this.dtack_environment);
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't start the changewatcher because " + exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    this.debug(F, message);
  }

  if (this.changewatcher != undefined)
  {
                                          // object which watches for page changes
    this.changewatcher.initialize(options);
  }

} // end method
                           
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.initialize_idlewatcher = function(options)
{
  var F = "dtack_page_base_c::initialize_idlewatcher";
  
  var section = this.host_value("idlewatcher");

  if (this.option_value(section, "enabled", "no") == "yes")
  {
                                        // fail gracefully if idlewatcher class include file is missing
    try
    {
      this.idlewatcher = new dtack_idlewatcher_c(this.dtack_environment);
    }
    catch(exception)
    {
      var message;
      if (exception.name != undefined)
        message = "can't initialize the idlewatcher because " + exception.name + " (" + exception.message + ")";
      else
        message = exception;
      
      this.debug_verbose(F, message);
    }
  }
  else
  {
    this.debug_verbose(F, "not initializing the idlewatcher because not enabled in host");
  }
  
  if (this.idlewatcher != undefined)
  {
    this.idlewatcher.initialize(section);
  }

} // end method
                           
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.initialize_scrollables = function(options)
{
  var F = "dtack_page_base_c::initialize_scrollables";
  
  var section = this.host_value("scrollables");

  if (this.option_value(section, "enabled", "yes") == "yes")
  {
                                        // fail gracefully if scrollables class include file is missing
    try
    {
      this.scrollables = new dtack__dom__scrollables_c(this.dtack_environment);
    }
    catch(exception)
    {
      var message;
      if (exception.name != undefined)
        message = "can't initialize the scrollables because " + exception.name + " (" + exception.message + ")";
      else
        message = exception;
      
      this.debug(F, message);
    }
  }
  else
  {
    this.debug_verbose(F, "not initializing the scrollables because not enabled in host");
  }
  
  if (this.scrollables != undefined)
  {
    this.scrollables.initialize(section);
  }

} // end method
                           
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.add_scrollable = function(selector, options)
{
  var F = "dtack_page_base_c::add_scrollable";
  
  if (this.scrollables != undefined)
  {
    this.scrollables.add(selector, options);
  }
  else
  {
    this.debug_verbose(F, "not add the scrollable selector \"" + selector + " because scrollables object is not defined");
  }

} // end method
// -------------------------------------------------------------------------------
// initialize page-wide keystroke handling
// watchfrog #163
  
dtack_page_base_c.prototype.initialize_keys = function(options)
{
  var F = "dtack_page_base_c::initialize_keys";
  
  var that = this;
  
  $(document).keydown(
    function(jquery_event_object) 
    {
//      that.debug("document_keydown", "key which \"" + jquery_event_object.which + "\"" +
//       ", altKey \"" + jquery_event_object.altKey + "\"" +
//       ", shiftKey \"" + jquery_event_object.shiftKey + "\"");
       
                                        // for now, just disable this feature
                                        // eztask #16460 F4 causes the Tool host to crash and should do nothing
      if (false)
      {
                                        // user hit F6?
                                        // allow F6 to refresh without confirmation dialog
                                        // watchfrog #199
        if (jquery_event_object.which == 117)
        {
          var webhit_autoid = parseInt(that.option_value(dtack_javascript.webhit, "autoid", null));
      	  if (!isNaN(webhit_autoid))
      	  {
      	                                // don't do the normal F5 things
      	    jquery_event_object.preventDefault();
      	    jquery_event_object.stopImmediatePropagation();
      	    jquery_event_object.stopPropagation();
      	    
      	                                // post a webhit replay command
      	    that.post({
      	  	  "jquery_event_object": jquery_event_object,
      	      "url": location.href,
      	      "command": "replay_webhit",
      	      "arguments": webhit_autoid,
      	      "should_post_scroll": "yes"
		    });
		  }
        }
                                                                          
                                        // user hit F4?
        if (jquery_event_object.which == 115)
        {
          if (!jquery_event_object.altKey)
          {
      	    that.post({
      	  	  "jquery_event_object": jquery_event_object,
      	      "url": location.href,
      	      "should_post_scroll": "yes"
		    });
		  }
        }
      }
    }
  ); 
} // end method

// -------------------------------------------------------------------------------
// initialize miniwindow dialog
  
dtack_page_base_c.prototype.initialize_miniwindow_dialog = function(options)
{
  var F = "dtack_page_base_c::initialize_miniwindow_dialog";
  
  try
  {
    this.miniwindow_dialog = new dtack_miniwindow_dialog_c(this);
    this.miniwindow_dialog.initialize();
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't initialize the miniwindow dialog because " + exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    this.debug_verbose(F, message);
  }
  
} // end method

// -------------------------------------------------------------------------------
// this is called from the body onload or after all the elements are in the DOM

dtack_page_base_c.prototype.activate = function()
{
  var F = "dtack_page_base_c::activate";
                        

  var that = this;
                                        // hide dtack_environment_debug_message if debug not on
                                        // watchfrog #2
  this.dtack_environment_debug_message_node = this.want_element(F, "dtack_environment_debug_message");

  if (this.dtack_environment_debug_message_node &&
      this.dtack_environment.debug_level != 1 &&
      this.dtack_environment.cgis["debug"] != "1")
    this.dtack_environment_debug_message_node.style.display = "none";
  
                                        // adjust dtui styles       
                                        // watchfrog #
  this.activate_dtui_style_adjustments();
                 
  this.activate_idlewatcher();

                                        // react to posted scroll request
                                        // the desired scroll value needs to be in the REQUEST object
                                        // watchfrog #162
  this.activate_posted_scroll();
                                        // activate  the dyemarker buttons
  if (this.dyemarker_buttons)
    this.dyemarker_buttons.activate();
                                                             
} // end method
                             
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.activate_dtui_style_adjustments = function(options)
{
  var F = "activate_dtui_style_adjustments";
  
  var $items;
                                        // find all the dtui xregions which have a textbox
  $items = 
    $("TD.dtui_xregions_value_div > .dtproperty_textbox").
    closest("TD").
    prev("TD");
    
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_textbox");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_textbox");
                            
                                        // find all the dtui input regions which have a textbox
  $items = 
    $("TD.dtui_input_regions_input_td > .dtproperty_textbox").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_input_regions_input_td > .dtproperty_textbox");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_textbox");
                            
  
                                        // find all the dtui xregions which have a pulldown
  $items = 
    $("TD.dtui_xregions_value_div > .dtproperty_pulldown").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_pulldown");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_pulldown");
  
  
                                        // find all the dtui input regions which have a pulldown
  $items = 
    $("TD.dtui_input_regions_input_td > .dtproperty_pulldown").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_input_regions_input_td > .dtproperty_pulldown");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_pulldown");
  
  
                                        // find all the dtui xregions which have a radio
  $items = 
    $("TD.dtui_xregions_value_div > .dtproperty_radios_td").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_radios_td");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_radios");
  
                                        // find all the dtui xregions which have a checkbox
  $items = 
    $("TD.dtui_xregions_value_div > .dtproperty_checkboxes_td").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_checkboxes_td");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_checkboxes");
  
                                        // find all the dtui xregions which have a sublist
  $items = 
    $("TD.dtui_xregions_value_div > .dtproperty_sublist").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_sublist");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_sublist");
  
                                        // find all the dtui xregions which have a sublist
  $items = 
    $("TD.dtui_input_regions_input_td > .dtproperty_sublist").
    closest("TD").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + ".dtui_xregions_value_div > .dtproperty_sublist");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_sublist");
  
                                        // find all the dtui xregions which have a limit group
  $items = 
    $("#limitgroup_value").
    prev("TD");
  
  //this.debug(F, "found " + $items.length + "#limitgroup_value");
                                        // this makes the label TD align better when the corresponding value TD when it has a textbox input value 
  $items.addClass("T_prompt_for_limitgroup");

} // end method
                            
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.activate_idlewatcher = function(options)
{
  var F = "activate_idlewatcher";

  if (this.host_value("idlewatcher.should_activate", "no") != "yes")
  {
    this.debug_verbose(F, "not activating the idlewatcher because host idlewatcher.should_activate is \"" + this.host_value("idlewatcher.should_activate", "no") + "\"");
  }
  else
  
  if (this.idlewatcher != undefined)
  {
    this.debug(F, "activating the idlewatcher");
    this.idlewatcher.activate(options);
  }
  else
  {
    this.debug_verbose(F, "not activating the idlewatcher because object is still undefined");
  }

} // end method

// -------------------------------------------------------------------------------
dtack_page_base_c.prototype.activate_fileuploads = function(options)
{
  var F = "dtack_page_base_c::activate_fileuploads";
                                                    
                                        // allow options to specify container which houses the fileuploads to be activated
                                        // the default is all on the page 
                                        // watchfrog #223            
  var $container = this.option_value(options, "$container", null);
  
  var $file_inputs;
  
  if ($container)
    $file_inputs = $("DIV.dtproperty_mini_fileuploader INPUT[type=\"file\"]", $container);
  else
    $file_inputs = $("DIV.dtproperty_mini_fileuploader INPUT[type=\"file\"]");
  
  this.debug_verbose(F, "found " + $file_inputs.length + " FILE inputs");
  
  var that = this;
                                        // attach a mini_uploader object to each FILE form element and activate it
  $file_inputs.each(
    function(index, element) 
    {
      that.activate_fileupload_input($(this));
    }
  );
                                                    
  var $file_outputs = $("DIV.dtproperty_mini_fileuploader.T_output");
  
  this.debug_verbose(F, "found " + $file_outputs.length + " FILE outputs");
  
  var that = this;
                                        // attach a mini_uploader object to each FILE form element and activate it
  $file_outputs.each(
    function(index, element) 
    {
      that.activate_fileupload_output($(this));
    }
  );

} // end function

// -------------------------------------------------------------------------------
dtack_page_base_c.prototype.activate_fileupload_input = function($input)
{
  var F = "dtack_page_base_c::activate_fileupload_input";
  this.debug_verbose(F, "activating " + $input.attr("name"));
  
  var mini_uploader = new dtack__dom__mini_uploader_c(this, $input);
  
  mini_uploader.initialize();
  mini_uploader.activate();
} // end function
                  
// -------------------------------------------------------------------------------
dtack_page_base_c.prototype.activate_fileupload_output = function($output)
{
  var F = "dtack_page_base_c::activate_fileupload_output";
  this.debug_verbose(F, "activating " + $output.attr("name"));
  
  var mini_uploader = new dtack__dom__mini_uploader_c(this, $output);
  
  mini_uploader.initialize();
  mini_uploader.activate({is_output: "yes"});
} // end function

// -------------------------------------------------------------------------------
// this is generally called from the onload in tabularium: global_page_object.autogrow("{{id}}")

dtack_page_base_c.prototype.autogrow = function(id)
{
  var F = "autogrow";
  
  var found_plugin = false;
                                        // fail gracefully if jquery autogrow class include file is missing
                                        // watchfrog #218
  try
  {
    this.jquery_autogrow(id);
    this.debug(F, "started jquery autogrow");
    found_plugin = true;
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't start the jquery autogrow because " + exception.name + " (" + exception.message + ")";
    else
      message = "can't start the jquery autogrow because " + exception;
      
    this.debug(F, message);
  }
  
  if (!found_plugin)
  try
  {
                                        // find a better autogrow plugin and employ that in page base
                                        // watchfrog #211
    this.romanato_autogrow(id);
    this.debug(F, "started romanato autogrow");
    found_plugin = true;
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't start the romanato autogrow because " + exception.name + " (" + exception.message + ")";
    else
      message = "can't start the romanato autogrow because " + exception;
      
    this.debug(F, message);
  }
  
  if (!found_plugin)
  {
  	this.debug(F, "no autogrow available");
  }
  

} // end method

// -------------------------------------------------------------------------------
// this is generally called from the onload in tabularium: global_page_object.autogrow("{{id}}")
// this was the old autogrow
// from plugins/autogrow/1.0.3/autogrow.js
// https://plugins.jquery.com/autogrow/
dtack_page_base_c.prototype.jquery_autogrow = function(id)
{
  var F = "autogrow";
  
  $("#" + id).autogrow(
    {
      "onInitialize": true, 
      "animate": false, 
      "speed": 0, 
      "fixMinHeight": false});

} // end method

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.romanato_autogrow = function(id)
{
  var F = "romanato_autogrow";

  var line_height = $("#" + id).css("line-height");
  this.debug(F, "autogrow on " + id + ", original line-height \"" +  line_height+ "\"");
  
                                        // the plugin needs the text area to have a numeric line-height
  if (isNaN(parseFloat(line_height)))
    $("#" + id).css("line-height", "1.4");
    
  $("#" + id).romanato_autogrow();

} // end method


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.activate_posted_changes = function(selector, options)
{
  var F = "activate_posted_changes";

  var that = this;
  
  this.debug(F, "activating posted changes on \"" + selector + "\"");
  
  $text_selectors = $(selector + " INPUT:TEXT");
  $text_selectors.change(
    function(jquery_event_object) 
    {  
      that.add_to_posted_change_list2(jquery_event_object.target.name, that.POSTED_CHANGE_ACTION_CHANGED);
    }
  );
  
  $textarea_selectors = $(selector + " TEXTAREA");
  $textarea_selectors.change(
    function(jquery_event_object) 
    {  
      that.add_to_posted_change_list2(jquery_event_object.target.name, that.POSTED_CHANGE_ACTION_CHANGED);
    }
  );
  
  $pulldown_selectors = $(selector + " SELECT");
  $pulldown_selectors.change(
    function(jquery_event_object) 
    {  
      that.add_to_posted_change_list2(jquery_event_object.target.name, that.POSTED_CHANGE_ACTION_CHANGED);
    }
  );
  
  var $checkbox_selectors = $(selector + " INPUT:CHECKBOX");
  $checkbox_selectors.click(
    function(jquery_event_object) 
    {  
      that.add_to_posted_change_list2(jquery_event_object.target.name, that.POSTED_CHANGE_ACTION_CHANGED);
    }
  );
  
  this.debug(F, "activated posted changes on " + 
    $text_selectors.length + " text selector(s), " +
    $textarea_selectors.length + " textarea  selector(s), " +
    $pulldown_selectors.length + " pulldown selector(s), " +
    $checkbox_selectors.length + " checkbox selector(s)");
  
} // end function
                             
// -------------------------------------------------------------------------------
// this is called by the post method

dtack_page_base_c.prototype.validate = function(options)
{
  var F = "dtack_page_base_c::validate";

  //this.debug(F, "dtack_page_base_c::validating");
  
  return true;
} // end function

// -------------------------------------------------------------------------------
// this is the old method, called before ajax was a possibility

dtack_page_base_c.prototype.add_to_posted_change_list = function(dom_element)
{
  if (dom_element == undefined)
    return;
    
  this.add_to_posted_change_list2(dom_element.name, this.POSTED_CHANGE_ACTION_CHANGED);

} // end function

// -------------------------------------------------------------------------------
dtack_page_base_c.prototype.add_to_posted_change_list2 = function(field_name, action)
{
  var F = "add_to_posted_change_list2";
  
  if (!field_name)
  {
    this.debug_verbose(F, "unable to post change change to field_name " + this.vts(field_name));
    return;
  }
    
  if (this.posted_change_list[field_name] == undefined)
  {
  	                                    // if javascript were multithreaded, we would want to mutex this
  	                                    // because this method is called by the element's onchange()
  	                                    // and also asynchronously by ajax
    this.posted_change_list[field_name] = {
      "changed_count": 0,
      "ajax_expected_count": 0,
      "ajax_started_count": 0,
      "ajax_succeeded_count": 0,
      "ajax_failed_count": 0
    };
    
    this.posted_change_list_count++;
  }
                                        // for short
  var posted_change_item = this.posted_change_list[field_name];
  
  switch(action)
  {
  	case this.POSTED_CHANGE_ACTION_CHANGED:
  	  posted_change_item.changed_count++;
  	  this.debug_verbose(F, "seeing change to \"" + field_name + "\"");
  	  this.visualize_unsaved_changes();
  	break;
  	case this.POSTED_CHANGE_ACTION_AJAX_EXPECTED:
  	  posted_change_item.ajax_expected_count++;
  	break;
  	case this.POSTED_CHANGE_ACTION_AJAX_STARTED:
  	  posted_change_item.ajax_started_count++;
  	break;
  	case this.POSTED_CHANGE_ACTION_AJAX_SUCCEEDED:
  	  posted_change_item.ajax_succeeded_count++;
  	break;
  	case this.POSTED_CHANGE_ACTION_AJAX_FAILED:
  	  posted_change_item.ajax_failed_count++;
  	break;
  }
  
                                        // hide any confirmation messages on the page
                                        // don't automatically hide processing confirmation
                                        // watchfrog #176
  // $(".processing_confirmation_message_div").hide();

} // end function
                                                      
                                                      
// -------------------------------------------------------------------------------
// light up the fields that are supposed to react to saved changes

dtack_page_base_c.prototype.visualize_unsaved_changes = function()
{
  var F = "visualize_unsaved_changes";
  
  if (this.page_has_unsaved_changes())
  {
  	//this.debug(F, "visualizing unsaved changes");
    $(".show_if_unsaved_changes").addClass("_unsaved_changes");
    $(".hide_if_unsaved_changes").addClass("_unsaved_changes");
  }
  else
  {
  	//this.debug(F, "visualizing lack of unsaved changes");
    $(".show_if_unsaved_changes").removeClass("_unsaved_changes");
    $(".hide_if_unsaved_changes").removeClass("_unsaved_changes");
  }
} // end function
                                                      
                                                      
// -------------------------------------------------------------------------------
// prepare a form field value which is a csv value of all changed but not ajaxed fields

dtack_page_base_c.prototype.assign_posted_change_field = function(form_name, field_name)
{
  var F = "assign_posted_change_field";
  
  var posted_change_csv = "";
  
  for (var k in this.posted_change_list)
  {
  	var posted_change_item = this.posted_change_list[k];
  	
  	                                    // value is changed but we expect this field to be handled by ajax?
  	if (posted_change_item.changed_count > 0 &&
  	    posted_change_item.ajax_expected_count == 0)
  	{
  	                                    // add to the csv list being built
  	  posted_change_csv += (posted_change_csv == ""? "": ",") + k;
	}
  }
      
  if (form_name === undefined)
    form_name = document.forms[0].name;
    
  var form = document.forms[form_name];
  if (form === undefined)
  {
  	this.debug(F, "no such form named \"" + form_name + "\" trying to assign posted change field \"" + field_name + "\"");
  	return;
  }
  
                                        // determine name of hidden field to hold the csv value
  var field = undefined;
  var field_name = "posted_change_list";
  field = form[field_name];
  if (field == undefined)
  {
  	field_name = "changed";
    field = form[field_name];
  }
  if (field == undefined)
  {
  	$(form).append("<input type=\"hidden\" name=\"" + field_name + "\">");
    field = form[field_name];
  }
        
  field.value = posted_change_csv;             

} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.page_has_unsaved_changes = function()
{
  var F = "page_has_unsaved_changes";
                                  
  for (var k in this.posted_change_list)
  {
  	var posted_change_item = this.posted_change_list[k];
  	
  	                                    // value is changed but we expect this field to be handled by ajax?
  	if (posted_change_item.changed_count > 0 &&
  	    posted_change_item.ajax_expected_count == 0)
  	{
  	  this.debug_verbose(F, "posted_change_list[" + this.vts(k) + "]" +
  	    " change count is " + this.vts(posted_change_item.changed_count) +
  	    " but ajax_expected_count is " + this.vts(posted_change_item.ajax_expected_count));
  	  return true;
	}
  }

  return false;
} // end method
                                               

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.page_has_unfinished_ajax = function()
{
  var F = "page_has_unfinished_ajax";
                            
  var ajax_started_count = 0;
  var ajax_finished_count = 0;                                 
  
  for (var k in this.posted_change_list)
  {
  	var posted_change_item = this.posted_change_list[k];
  	
    ajax_started_count += posted_change_item.ajax_started_count;
    ajax_finished_count += posted_change_item.ajax_succeeded_count + posted_change_item.ajax_failed_count;
  }
  
                                        // return page level ajax (this is deprecated)
  var has_unfinished_ajax = ajax_started_count > ajax_finished_count;
  
  //this.debug(F, "page level ajax has " + (ajax_started_count - ajax_finished_count) + " unfinished ajax");
  
                                        // we have an ajax watcher object?
  if (this.ajax_watcher !== undefined)
  {
  	has_unfinished_ajax |= this.ajax_watcher.page_has_unfinished_ajax();
  }

  return has_unfinished_ajax;
  
} // end method
                                               

// -------------------------------------------------------------------------------
dtack_page_base_c.prototype.posted_change_list_debug = function(F, form_name, field_name)
{
  if (F == undefined)
    F = "posted_change_list_debug";
    
  var i = 0;  
  for (var k in this.posted_change_list)
  {
  	var posted_change_item = this.posted_change_list[k];
  	this.debug(F, (++i) + ". posted change to \"" + k + "\"," +
  	  " changed " + posted_change_item.changed_count + " time" + (posted_change_item.changed_count == 1? "": "s") + "," +
  	  " ajax expected " + posted_change_item.ajax_expected_count + " time" + (posted_change_item.ajax_expected_count == 1? "": "s") + "," +
  	  " started " + posted_change_item.ajax_started_count + " time" + (posted_change_item.ajax_started_count == 1? "": "s") + "," +
  	  " succeeded " + posted_change_item.ajax_succeeded_count + " time" + (posted_change_item.ajax_succeeded_count == 1? "": "s") + "," +
  	  " failed " + posted_change_item.ajax_failed_count + " time" + (posted_change_item.ajax_failed_count == 1? "": "s"));
  }
  
      
  if (form_name == undefined)
    form_name = "form1";
                                        // determine name of hidden field to hold the csv value
  if (field_name == undefined)
    field_name = "posted_change_list";

  var value = document.forms[form_name][field_name].value;
  
  this.debug(F, 
    "page " + (this.page_has_unsaved_changes()? "HAS": "DOES NOT HAVE") + " unsaved changes");
  this.debug(F, 
     "document.forms[" + form_name + "][" + field_name + "] as been assigned \"" + value + "\"");

} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.confirm = function(confirmation_message, options)
{
  var F = "confirm";

                                        // resolve page posting confirmation messages through environment symbols
                                        // watchfrog #187
  confirmation_message = this.dtack_environment.resolve_symbol(confirmation_message, confirmation_message);
  
  var r = confirm(confirmation_message);
  
  //this.debug(F, "returning " + r + " from " + confirmation_message);
  
  return r;
  
} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.post = function(options)
{
  var F = "post";
  
  return this.post_simple(options);
  
} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.determine_post_option_value = function(
  options,
  option,
  default_value)
{
  var F = "determine_post_option_value";
 
  var shifted_value = null;
                                        // we are being given an event?
  if (options !== undefined)
  {
  	if (options.jquery_event_object !== undefined)
    {                                       
  	                                    // the shift key is down?
      if (options.jquery_event_object.shiftKey)
  	  {
  	                                    // use the shifted value
  	    shifted_value =  this.option_value(options, option + "_shift", null);
	  }
	}
	else
  	if (options.onclick_event_object !== undefined)
    {                                       
  	                                    // the shift key is down?
      if (options.onclick_event_object.shiftKey)
  	  {
  	                                    // use the shifted value
  	    shifted_value =  this.option_value(options, option + "_shift", null);
	  }
	}
  }
  
  if (shifted_value !== null)
  {
  	//this.debug(F, "found shifted value for " + option);
  	
    return shifted_value;
  }
  else
  {
  	//this.debug(F, "no shifted value for " + option);
                                        // get the value like normal
                                        // watchfrog #190
    return this.option_value(options, option, default_value);
  }
    
} // end function


// -------------------------------------------------------------------------------
// adjust options if pdf shortcut is present
// watchfrog #166

dtack_page_base_c.prototype.adjust_post_options_for_pdf = function(options)
{
  var F = "adjust_post_options_for_pdf";

  var value = this.option_value(options, "pdf", null);
  
  if (value == "yes")
  {
  	value = this.option_value(options, "url", null);
  	
  	if (value !== null)
  	{
  	  this.debug(F, "adjusting url for PDF options");
  	  
  	  if (value.indexOf("?") == -1)
  	    value += "?";
  	  else
  	    value += "&";
  	  
  	  options["url"] = value + "pdf=yes";
  	  options["url_shift"] = value + "pdf=no";
  	  options["target_shift"] = "_blank";
	}

  	value = this.option_value(options, "target", null);
  	
  	if (value === null)
  	{
  	                                    // specify target for PDF because otherwise IE will open in same window
  	                                    // eztask #12597: opens below the menu and no way to get back to the calling page
  	                                    // watchfrog #167
  	  options["target"] = "_blank";
	}
  }
                                  
} // end function

// -------------------------------------------------------------------------------
// adjust options if wppdf shortcut is present

dtack_page_base_c.prototype.adjust_post_options_for_wppdf = function(options)
{
  var F = "adjust_post_options_for_wppdf";

  if (this.is_affirmative_option(options, "wppdf"))
  {
  	var url = this.option_value(options, "url", null);
  	
  	if (url !== null)
  	{
  	  this.debug(F, "adjusting url for WPPDF options");
  	  
  	  if (url.indexOf("?") == -1)
  	    url += "?";
  	  else
  	    url += "&";
  	  
  	  options["url"] = url + "wppdf=create";
  	  options["target"] = "_blank";

  	  options["url_shift"] = url + "wppdf=preview";
  	  options["target_shift"] = "_blank";
	}
  }
                                  
} // end function

// -------------------------------------------------------------------------------
// adjust options based on other options shortcuts

dtack_page_base_c.prototype.adjust_post_options = function(options)
{
  var F = "adjust_post_options";
    
  this.adjust_post_options_for_pdf(options);
                                        // automatically handle request for wppdf page
                                        // watchfrog #235
  this.adjust_post_options_for_wppdf(options);
  
} // end function

// -------------------------------------------------------------------------------
// post if there is processing confirmation
// watchfrog #184

dtack_page_base_c.prototype.post_processing_confirmation = function(options)
{
  var F = "post_processing_confirmation";
  
  var $processing_confirmation = $(this.option_value(options, "processing_confirmation_selector", ".processing_confirmation_div"));
    
                                        // there is a processing confirmation div rendered into the current page
                                        // this is presuming that if there is any, then it has a useful value 
                                        // someday also check to see if it is not hidden and not blank?
  if ($processing_confirmation.length > 0)
  {
  	                                    // reference the form that is desired to be posted or default to first form on the page
    var form_name = this.option_value(options, "form", document.forms[0].name);
  	
  	                                    // create a field for posting the processing confirmation html
    this.post_field_value(
      form_name, 
      this.POSTED_PROCESSING_CONFIRMATION_FIELD_NAME, 
      $processing_confirmation.html());
      
                                        // post to the next form immediately
    this.post(options);
  }
  
} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.post_simple = function(options)
{
  var F = "dtack_page_base_c::post_simple";
                                            
  var that = this;
  
                                        // we are being given an event?
  if (options !== undefined &&
      options.jquery_event_object !== undefined)
  {                 
     options.jquery_event_object.stopPropagation();
     options.jquery_event_object.stopImmediatePropagation();
     options.jquery_event_object.preventDefault();
  }                      

  if (options != undefined &&
      options.onclick_event_object !== undefined)
  {                                       
    options.onclick_event_object.cancelBubble = true;
  }

                                        // adjust options based on other options shortcuts
                                        // watchfrog #166
  this.adjust_post_options(options);
                                        // let the derived class have a crack at validating the form
                                        // watchfrog #216
  if (!this.validate(options))
  {
  	this.debug(F, "not posting because validation failed");
    return false;
  }
                                        // allow alternate posted url and target if shift-clicking
                                        // watchfrog #165
  var form_name = this.determine_post_option_value(options, "form", document.forms[0].name);
  var form_action = this.determine_post_option_value(options, "url", undefined);
  var command = this.determine_post_option_value(options, "command", undefined);
  var arguments = this.determine_post_option_value(options, "arguments", undefined);
  var form_target = this.determine_post_option_value(options, "target", undefined);
  var form_method = this.determine_post_option_value(options, "method", "post");
  var extra_form_fields = this.determine_post_option_value(options, "extra_form_fields_json", undefined);
                                  
                                        // show waiting indicator if appropriate 
                                        // show waiting indicator early
                                        // watchfrog #196
                                        // rearrange order of operations in page post
                                        // watchfrog #198
  this.show_post_waitix(options);
        
                                        // wait for unfinished ajax operations
                                        // this will return true if further waiting is needed
                                        // check for ajax completions EARLY
                                        // watchfrog #213
//  if (this.wait_post_for_unfinished_ajax(options))
//    return;
  
  var should_confirm_unsaved_changes = this.option_value(options, "should_confirm_unsaved_changes", "yes");

  if (should_confirm_unsaved_changes == "yes" &&
      this.page_has_unsaved_changes())
  {
    var confirmation_message = this.option_value(options, "confirm_unsaved_changes_message",
  	  "There are unsaved changes on this page." +
  	  "\n\nPlease click OK to continue to navigate off this page and abandon the changes." +
  	  "\n\nClick Cancel to cancel the button and stay on this page.");
    
    var answer = confirm(confirmation_message);
    
  	if (!answer)
    {
      dtack_page_waitix.hide();
      return false;
	}
	                                    // always use navigation_form for posting when unsaved changes are abandoned
	                                    // eztask #14977 SATWAP BMP List: My changes are not being abandoned
	                                    // watchfrog #244
	form_name = this.CONSTANTS.FORM_NAMES.NAVIGATION;
  }

  
  var $form;
                                        // form with desired name already exists?
  if (document.forms[form_name])
  {
  	                                    // wrap a jquery object around it
  	$form = $(document.forms[form_name]);
  }
                                        // a form with this name does not exist yet?
  else
  {
                                        // allow caller to specify a new form name which is created on the fly
                                        // watchfrog #239
  	$form = $("<form name=\"" + form_name + "\"></form>");
  	$("BODY").append($form);
  }
                                        // for direct access to form node (not via jquery)
  var form = $form.get(0);
  
                                        // allow caller to specify form field/value pairs to be posted
                                        // watchfrog #238
  this.post_extra_form_fields(form_name, extra_form_fields)
                                        // prepare a hidden form field value which is a csv value of all changed but not ajaxed fields
  this.assign_posted_change_field(form_name, "posted_change_list"); 
  
  var confirmation_message = this.option_value(options, "confirmation_message", undefined);
  if (confirmation_message)
  {
  	var answer = this.confirm(confirmation_message, options);
  	if (!answer)
    {
      dtack_page_waitix.hide();
      return false;
	}
  }
        
                                        // wait for unfinished ajax operations
                                        // this will return true if further waiting is needed
                                        // check for ajax completions late
                                        // watchfrog #196
  if (this.wait_post_for_unfinished_ajax(options))
    return;

  var should_post_crumb = this.option_value(options, "should_post_crumb", "*unset*");
  
  this.debug(F, "options[should_post_crumb] is \"" +  should_post_crumb+ "\"");
  
  if (should_post_crumb == "yes" ||
      should_post_crumb == "*unset*")
  {
                                        // post current page crumb by adding field to form and filling it with value
                                        // watchfrog #174
    this.post_crumb(form_name);
  }
  else
  if (should_post_crumb == "prior")
  {
    this.post_crumb_prior(form_name);
  }
  else
  if (should_post_crumb == "prior_prior")
  {
    this.post_crumb_prior_prior(form_name);
  }
    
  var should_post_scroll = this.option_value(options, "should_post_scroll", "no") == "yes" && should_post_crumb != "prior";
  
  if (should_post_scroll)
  {
    this.post_scroll(form_name);
  }

  if (dtack_environment.host_value("development.confirm_post", "no") == "yes")
  {
    var answer =  this.confirm("(host.development.confirm_post) OK to post?" +
       (form_action === undefined? "": "\n\nto url: " + form_action) +
       (command === undefined? "": "\n\nwith command: \"" + command + "\"") +
       (arguments === undefined? "": "\n\nwith arguments: " + arguments) +
       (form_target === undefined? "": "\n\nto window target: " + form_target));
    if (!answer)
    {
      dtack_page_waitix.hide();
      return false;
	}
  }

  
  var old_form_action = undefined;
  if (form_action != undefined)
  {
  	old_form_action = form.action;
    form.action = form_action;
  }

  var old_form_target = undefined;
  if (form_target != undefined)
  {
  	old_form_target = form.target;
    form.target = form_target;
  }

  var old_form_method = undefined;
  if (form_method != undefined)
  {
  	old_form_method = form.method;
    form.method = form_method;
  }

  if (command != undefined)
  {
  	if (form.command2 != undefined)
      form.command2.value = command;

                                        // post value for command2 and command also, whichever or both are present
                                        // watchfrog #234
  	if (form.command != undefined)
      form.command.value = command;
  }

  if (arguments != undefined)
  {
  	if (form.arguments2 != undefined)
      form.arguments2.value = arguments;

  	if (form.arguments != undefined)
      form.arguments.value = arguments;
  }
  
                                        // we have been assigned a registered dashboard connection object?
  if (this.has_a_registered_protocol3_dashboard_connection())
  {
    this.debug(F, "posting form by dashboard connection");
    this.post_form_by_dashboard_connection(options.onclick_element, form_action, form, true);
  }
  else
  {
    this.debug(F, "posting form by form submit");
    form.submit();
  }

  if (form_method != undefined)
  {
    form.method = old_form_method;
  }

  if (form_target != undefined)
  {
    form.target = old_form_target;
  }

  if (form_action != undefined)
  {
    form.action = old_form_action;
  }
   
  return false;
          
} // end method

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.has_a_registered_protocol3_dashboard_connection = function(form_action, form, inhibit_debug)
{
  var F = "dtack_page_base_c::has_a_registered_protocol3_dashboard_connection";
          

          
  if (!this.dashboard_connection)
  {
    this.debug(F, "this.dashboard_connection is " + this.vts(this.dashboard_connection));
    return false;
  }
    
  if (!this.dashboard_connection.registered)
  {
    this.debug(F, "this.dashboard_connection.registered is " + this.vts(this.dashboard_connection.registered));
    return false;
  }
  
  if (this.dashboard_connection.dashboard_protocol != "3")
  {
    this.debug(F, "this.dashboard_connection.dashboard_protocol is " + this.vts(this.dashboard_connection.dashboard_protocol));
    return false;
  }
  
  return true;
  
} // end method

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.post_form_by_dashboard_connection = function(onclick_element, form_action, form, inhibit_debug)
{
  var F = "dtack_page_base_c::post_form_by_dashboard_connection";
  
  var form_packet = new dtack__basic__packet_c(this.dtack_environment, "form");
  
                                        // eztask #16122 toolhost: ugly error clicking to view a 105 report
  form_packet.attribs.name = this.escape_xml(form.name);
  form_packet.attribs.action = form_action === undefined? "": this.escape_xml(form.action);   

                                        // loop through all the elements on the form
  var n = form.elements.length;
  for(var i=0; i<n; i++)
  {
    var $element = $(form.elements[i]);

    var value = null;
    
    if ($element.is("[type=checkbox]"))
    {
                                        // act like regular browser and send nothing for an unchecked checkbox
      if ($element.prop("checked"))
        value = $element.prop("value");
    }
    else
    if ($element.is("[type=radio]"))
    {
      if ($element.prop("checked"))
        value = $element.prop("value");
    }
    else
    if ($element.is("[type=file]"))
    {
                                        // don't send any value for the FILE elements
                                        // instead, hopefully the file_upload_interaction should have created a partner input text field
      value = null;
    }
    else
    {
      value = $element.val();
    }
    
    if (value !== null)
    {
                                        // add an individual sub-packet for each element
      var element_packet = form_packet.new_packet("element_" + i);
    
      element_packet.scalars.name = $element.attr("name");
    
      if ($element.attr("id"))    
        element_packet.scalars.id = $element.attr("id");
      
      element_packet.scalars.value = this.escape_xml(value);
    }
  }
                                        // remember the element which was clicked
  if (onclick_element)
  {
    this.$dashboard_connection_onclick_element = $(onclick_element);
    
                                        // add hourglass icon to indicate something is going to happe
                                        // eztask #16030 toolhost: clicking to view PDF of signed inspection report incurs delay, so should show hourglass or something
    this.$dashboard_connection_onclick_element.addClass("T_dashboard_connection_onclick_element");
  }
  else
  {
    this.$dashboard_connection_onclick_element = null;
  }
  
  
  this.dashboard_connection.send_packet(
    this.CONSTANTS.EVENTS.SEND_FORM_BY_DASHBOARD_CONNECTION,
    form_packet, 
    inhibit_debug);

} // end method
                                                     
                                                      
// -------------------------------------------------------------------------------
// update the display as necessary after the new window is launched
// by default, this just removes the hourglass icon from the element which had been clicked

dtack_page_base_c.prototype.dashboard_connection_has_launched_window = function()
{
  var F = "dtack_page_base_c::dashboard_connection_has_launched_window";

  if (this.$dashboard_connection_onclick_element)
  {
    this.$dashboard_connection_onclick_element.removeClass("T_dashboard_connection_onclick_element");
    
    this.$dashboard_connection_onclick_element = null;
  }

} // end method
                                                     
                                                      
// -------------------------------------------------------------------------------
// allow caller to specify form field/value pairs to be posted
// watchfrog #238
dtack_page_base_c.prototype.post_extra_form_fields = function(form_name, extra_form_fields)
{
  var F = "dtack_page_base_c::post_extra_form_fields";
                             
  if (form_name === undefined)
    form_name = document.forms[0].name;
    
  var form = document.forms[form_name];
  
  if (form === undefined)
  {
    this.debug(F, "not posting " + form_name + " extra form fields because form cannot be found")
    return;
  }
  
  var $form = $(form);
                                        // caller is requesting specific form field/value pairs be posted?
  if (!extra_form_fields)
  {                                                   
    this.debug(F, "not posting " + form_name + " extra form fields because none specified")
    return;
  }

  for(var extra_form_field_name in extra_form_fields)
  {
  	if (!form.elements[extra_form_field_name])
  	{
      var form_field_html = "<input type=\"hidden\"" +
        " name=\"" + extra_form_field_name + "\">";
      
      $form.append(form_field_html);
    
  	  this.debug(F, "appending newly created field " + this.vts(form_field_html));
	}
	else
	{
  	  this.debug(F, "form already has field " + this.vts(extra_form_field_name));
    }
                                        // always do it this way so the value doesn't have to be uri-encoded for the value prop in the tag
                                        // eztask #15786 IRENE: Punch list generates blank first time the populated after that 
  	                                    // assign the value to the newly created or existing extra form field
  	                                    // watchfrog #240
 	form.elements[extra_form_field_name].value = extra_form_fields[extra_form_field_name]; 
  }

} // end method

                                                      
// -------------------------------------------------------------------------------
// allow caller to specify form field/value pairs to be posted
// watchfrog #238
dtack_page_base_c.prototype.append_extra_form_fields = function(url, extra_form_fields)
{
  var F = "dtack_page_base_c::append_extra_form_fields";
                                        // caller is requesting specific form field/value pairs be posted?
  if (!extra_form_fields)
  {                                                   
    this.debug(F, "not adding extra form fields because none specified")
    return url;
  }

  for(var extra_form_field_name in extra_form_fields)
  {
      url += (url.indexOf("?") < 0? "?": "&") +
        extra_form_field_name + 
        "=" + encodeURIComponent(extra_form_fields[extra_form_field_name]);
  }

  return url;
  
} // end method

                                                                                                       
                                                      
// -------------------------------------------------------------------------------
// show waiting indicator early
// watchfrog #196
dtack_page_base_c.prototype.show_post_waitix = function(options)
{
  var F = "show_post_waitix";
            
  var should_inhibit_waitix = 
    this.option_value(options, "should_inhibit_waitix", "no");
  try
  {
    var options_target = this.determine_post_option_value(options, "target", undefined);

  	                                    // don't show waiting indicator if target given
  	                                    // watchfrog #170
  	if (options_target !== undefined &&
        options_target !== "_self" &&
        options_target !== "")
  	{
      this.debug_verbose(F, "not showing waiting indicator because form_target is \"" + form_target + "\"");
	}
	else
  	if (should_inhibit_waitix != "yes")
    {
      this.debug_verbose(F, "showing waiting indicator");
      dtack_page_waitix.show("please wait...");
	}
	else
	{
      this.debug_verbose(F, "not showing waiting indicator because options[should_inhibit_waitix] is yes");
	}
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't show page waiting indicator because " + exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    this.debug_verbose(F, message);
  }

} // end method

                                                      
// -------------------------------------------------------------------------------
// this returns true if further waiting is needed before the post can continue
// check for ajax completions late
// watchfrog #196

dtack_page_base_c.prototype.wait_post_for_unfinished_ajax = function(options)
{
  var F = "wait_post_for_unfinished_ajax";
                                        // there are unfinished ajax requests outstanding?
                                        // watchfrog #175
  if (!this.page_has_unfinished_ajax())
  {
                                        // reset the wait time for the next post
    this.this_wait_for_unfinished_ajax_milliseconds = 0;
  	return false;
  }
          
  var form_target = this.determine_post_option_value(options, "target", undefined);
  if (form_target !== undefined &&
      form_target !== "_self" &&
      form_target !== "")
  {
                                        // reset the wait time for the next post
    this.this_wait_for_unfinished_ajax_milliseconds = 0;
  	return false;
  }

  var should_wait = 
  	this.this_wait_for_unfinished_ajax_milliseconds <
  	this.max_wait_for_unfinished_ajax_milliseconds;
  	
  	                                  // we have waited too long already?
  if (!should_wait)
  {
  	                                  // ask the user to continue or not
  	should_wait = confirm(
  	  "The system seems to be taking a long time to automatically save your changes." +
  	  "\n\nPlease click OK to wait a few more seconds." +
  	  "\n\nClick Cancel to stop waiting (and possibly lose your last changes)." +
  	  "\n\n");
  	                                  // reset the wait time to start looping again
  	this.this_wait_for_unfinished_ajax_milliseconds = 0;
  }
                                      // we are supposed to keep polling?
  if (should_wait)
  {
  	this.debug(F, "waiting for unfinished ajax," + 
  	  " have waited " + this.this_wait_for_unfinished_ajax_milliseconds + "ms" +
  	  " out of " + this.max_wait_for_unfinished_ajax_milliseconds);
  	  
  	                                  // bump up the total time waited so far
  	this.this_wait_for_unfinished_ajax_milliseconds += 100;
  	
  	var that = this;
  	                                  // pause until some time later and try again
    setTimeout(function() {that.post(options);}, 100);
  }
  else
  {
                                        // reset the wait time for the next post
    this.this_wait_for_unfinished_ajax_milliseconds = 0;
  }

  return should_wait;

} // end method
 
// -------------------------------------------------------------------------------
// react to posted scroll request
// the desired scroll value needs to be in the REQUEST object
// watchfrog #162

dtack_page_base_c.prototype.activate_posted_scroll = function()
{
  var F = "dtack_page_base_c::activate_posted_scroll";
  
  var posted_scroll = undefined;
  
  var message0;
  if (posted_scroll == undefined)
  {
  	                                    // look for posted scroll in the generalized symbols area
  	                                    // watchfrog #188
    try
    {
  	  posted_scroll = this.dtack_environment.resolve_symbol(this.POSTED_SCROLL_FIELD_NAME, undefined);
  	  
  	  if (posted_scroll === this.POSTED_SCROLL_FIELD_NAME)
  	  {
  	  	message0 = "dtack_environment.resolve_symbol(" + this.POSTED_SCROLL_FIELD_NAME + ") was undefined";
  	  	posted_scroll = undefined;
	  }
	  else
	  {
	  	this.debug_verbose(F, "dtack_environment.resolve_symbol(" + this.POSTED_SCROLL_FIELD_NAME + ") was \"" + posted_scroll + "\"");
	  }
    }
    catch(exception)
    {
      if (exception.name != undefined)
        message0 = "looking for posted_scroll (0) but got : " + exception.name + " (" + exception.message + ")";
      else
        message0 = exception;
    }
  }
  
  var message1;
  if (posted_scroll == undefined)
  {
    try
    {
  	  posted_scroll = global_page_data._REQUEST[this.POSTED_SCROLL_FIELD_NAME];
    }
    catch(exception)
    {
      if (exception.name != undefined)
        message1 = "looking for posted_scroll but got : " + exception.name + " (" + exception.message + ")";
      else
        message1 = exception;
    }
  }
  
  var message2;
  if (posted_scroll == undefined)
  {
    try
    {
      posted_scroll = dtack_javascript[this.POSTED_SCROLL_FIELD_NAME];
    }
    catch(exception)
    {
      if (exception.name != undefined)
        message2 = "looking for posted_scroll but got: " + exception.name + " (" + exception.message + ")";
      else
        message2 = exception;
    }
  }
  
  var message3;
  if (posted_scroll === undefined ||
      posted_scroll === "")
  {
    try
    {
      posted_scroll = dtack_javascript[this.CRUMB_SCROLL_FIELD_NAME];
    }
    catch(exception)
    {
      if (exception.name != undefined)
        message3 = "looking for dtack_javascript[this.CRUMB_SCROLL_FIELD_NAME] but got: " + exception.name + " (" + exception.message + ")";
      else
        message3 = exception;
    }
  }
        
  if (posted_scroll == undefined)
  {
    this.debug_verbose(F, "can't activate posted scroll because " + message0);
    this.debug_verbose(F, "furthermore, can't activate posted scroll because " + message1);
    this.debug_verbose(F, "furthermore, can't activate posted scroll because " + message2);
    this.debug_verbose(F, "furthermore, can't activate posted scroll because " + message3);
  }
  else
  if (posted_scroll == "")
  {
    this.debug_verbose(F, "can't activate posted scroll because blank value given for it");
  }
  else
  if (this.scrollables == undefined)
  {
    this.debug_verbose(F, "can't activate posted scroll because this.scrollables object is not defined");
  }
  else
  {
  	                                    // apply the posted scroll specification
    this.scrollables.apply(posted_scroll);
  }

} // end function

                                                      
// -------------------------------------------------------------------------------
// post current window scroll point by adding field to form and filling it with value
// watchfrog #162

dtack_page_base_c.prototype.post_scroll = function(form_name)
{
  var F = "dtack_page_base_c::post_scroll";

  if (this.scrollables == undefined)
  {
    this.debug(F, "can't post scroll because this.scrollables object is not defined");
  }
  else
  {
    this.post_field_value(
      form_name, 
      this.POSTED_SCROLL_FIELD_NAME, 
      this.scrollables.serialize());
  }

} // end function
                                                                                                 
// -------------------------------------------------------------------------------
// post current window scroll point by adding field to form and filling it with value
// watchfrog #162

dtack_page_base_c.prototype.post_scroll_from_crumb = function(form_name)
{
  var F = "dtack_page_base_c::post_scroll_from_crumb";
  
  this.post_field_value(
    form_name, 
    this.CRUMB_SCROLL_FIELD_NAME, 
    this.host_value("dtack_crumb.prior_scroll", ""));

} // end function
                                                                                                                           
// -------------------------------------------------------------------------------
// post current window scroll point by adding field to form and filling it with value
// watchfrog #162

dtack_page_base_c.prototype.post_field_value = function(form_name, field_name, value)
{
  var F = "dtack_page_base_c::post_field_value";
    
  if (form_name === undefined)
    form_name = document.forms[0].name;
    
  var form = document.forms[form_name];
  
  if (form === undefined)
  {
    this.debug(F, "not posting " + form_name + "[" + field_name + "] value \"" + value + "\" because form cannot be found")
  }
  else
  {
    var field = form[field_name];
    if (field == undefined)
    {
  	  $(form).append("<input type=\"hidden\" name=\"" + field_name + "\">");
      field = form[field_name];
    }
          
    field.value = value;  
    //this.debug(F, "posting " + form_name + "[" + field_name + "] value \"" + field.value + "\"")
  }
  

} // end function           
                 
// -------------------------------------------------------------------------------
// post current page crumb by adding field to form and filling it with value
// this is used in normal forward page motion

dtack_page_base_c.prototype.post_crumb = function(form_name)
{
  var F = "dtack_page_base_c::post_crumb";
      
  var crumb_autoid = this.host_value("dtack_crumb.autoid", undefined);

  if (crumb_autoid === undefined)
  {
    this.debug(F, "not posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because no host_value(dtack_crumb.autoid)"); 
  }
  else
  if (crumb_autoid === "")
  {
    this.debug(F, "not posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because host_value(dtack_crumb.autoid) is blank"); 
  }
  else
  if (crumb_autoid === "0")
  {
    this.debug(F, "not posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because host_value(dtack_crumb.autoid) is 0"); 
  }
  else
  {
    this.post_field_value(form_name, this.CRUMB_AUTOID_FIELD_NAME, crumb_autoid);

    this.debug(F, "posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " with value " + crumb_autoid); 
      
                                        // nag if feature not enabled
    dtack_javascript_utility_feature_check("dtack_javascript crumbs");
  }          
      

  if (this.scrollables == undefined)
  {
    this.debug(F, "can't post crumb scroll because this.scrollables object is not defined");
  }
  else
  {
    this.post_field_value(
      form_name, 
      this.CRUMB_SCROLL_FIELD_NAME, 
      this.scrollables.serialize());
  }

} // end function


// -------------------------------------------------------------------------------
// post current page's prior crumb by adding field to form and filling it with value
// this is used in posts where you stay on the same page, such as deleting an item from a grid

dtack_page_base_c.prototype.post_crumb_prior = function(form_name)
{
  var F = "dtack_page_base_c::post_crumb_prior";
      
  var crumb_autoid = this.host_value("dtack_crumb.prior_autoid", undefined);

  if (crumb_autoid !== undefined)
  {
    this.post_field_value(form_name, this.CRUMB_AUTOID_FIELD_NAME, crumb_autoid);
    
    this.debug(F, "posting prior crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " with value " + crumb_autoid); 
  }          
  else
  {
    this.debug(F, "not posting prior crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because no host_value(dtack_crumb.prior_autoid)"); 
  }

  if (this.scrollables == undefined)
  {
    this.debug(F, "can't post prior crumb scroll because this.scrollables object is not defined");
  }
  else
  {
    this.post_field_value(
      form_name, 
      this.POSTED_SCROLL_FIELD_NAME, 
      this.scrollables.serialize());
  }

} // end function


// -------------------------------------------------------------------------------
// this is used by the back button
// we go to the "prior" page, telling it that its parent crumb is the origina prior that it had last time
// in the new page we always make a new crumb, even though coming back to a previous page
// this is so a crumb trail is not truncated by rolling back up the trail
// that is, a single node in the trail can have multiple forks leading from it
// might be useful someday to have multiple trails to go "forward" down
// or picking a crumb several steps down one of several trails
// if not wanted, we can always delete forks before making a new one

dtack_page_base_c.prototype.post_crumb_prior_prior = function(form_name)
{
  var F = "dtack_page_base_c::post_crumb_prior_prior";
      
  var crumb_autoid = this.host_value("dtack_crumb.prior_prior_autoid", undefined);

  if (crumb_autoid)
  {
    this.post_field_value(form_name, this.CRUMB_AUTOID_FIELD_NAME, crumb_autoid);
    this.debug(F, "posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " with value " + crumb_autoid); 
  }          
  else
  {
    this.debug(F, "not posting crumb \"" + this.CRUMB_AUTOID_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because host_value(dtack_crumb.prior_prior_autoid) is " + this.value_to_string(crumb_autoid)); 
  }
      
  var crumb_scroll = this.host_value("dtack_crumb.prior_scroll", undefined);

  if (crumb_scroll)
  {
    this.post_field_value(form_name, this.POSTED_SCROLL_FIELD_NAME, crumb_scroll);
  }          
  else
  {
    this.debug(F, "not posting crumb \"" + this.POSTED_SCROLL_FIELD_NAME + "\"" +
      " in form " + form_name + 
      " because host_value(dtack_crumb.prior_scroll) is " + this.value_to_string(crumb_scroll)); 
  }

} // end function


// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.jump = function(options)
{
  var F = "dtack_page_base_c::jump";
                                            
  var that = this;
  
  var url = this.determine_post_option_value(options, "url", undefined);
  
  if (url == undefined)
    return false;
  
                                        // we are being given an event?
  if (options.jquery_event_object != undefined)
  {                 
     options.jquery_event_object.stopPropagation();
     options.jquery_event_object.stopImmediatePropagation();
     options.jquery_event_object.preventDefault();
  }                      
  
                                        // allow caller to specify form field/value pairs to be added to the url
  var extra_form_fields = this.determine_post_option_value(options, "extra_form_fields_json", undefined);
  url = this.append_extra_form_fields(url, extra_form_fields);
  
  var should_confirm_unsaved_changes = this.option_value(options, "should_confirm_unsaved_changes", "yes");

  if (should_confirm_unsaved_changes == "yes" &&
      this.page_has_unsaved_changes())
  {
  	var answer = confirm("There are unsaved changes on this page." +
  	  "\n\nPlease click OK to continue with the action and ABANDON THE CHANGES." +
  	  "\n\nClick Cancel to cancel the button and stay on this page.");
  	if (!answer)
  	  return false;
  }
  
  var confirmation_message = this.option_value(options, "confirmation_message", undefined);
  if (confirmation_message)
  {
  	var answer = this.confirm(confirmation_message, options);
  	if (!answer)
  	  return false;
  }

  var should_inhibit_waitix = 
    this.option_value(options, "should_inhibit_waitix", "no");
                           
                                        // allow target to be specified in the jump method
                                        // watchfrog #192
  var target = this.determine_post_option_value(options, "target", undefined);
  
  if (target !== undefined &&
      target !== "" &&
      target !== "_self")
  {
    should_inhibit_waitix = "yes";
  }
  
  if (dtack_environment.host_value("development.confirm_post", "no") == "yes")
  {
    var answer =  this.confirm("(host.development.confirm_post) OK to jump?" +
       "\n\nto url: " + url +
       (target === undefined? "": "\n\nto window target: " + target));
    if (!answer)
      return false;
  }
    
  try
  {
  	if (should_inhibit_waitix != "yes")
    {
      dtack_page_waitix.show("please wait...");
	}
	else
	{
      this.debug(F, "not showing waiting indicator because options[should_inhibit_waitix] is yes");
	}
  }
  catch(exception)
  {
    var message;
    if (exception.name != undefined)
      message = "can't show page waiting indicator because " + exception.name + " (" + exception.message + ")";
    else
      message = exception;
      
    this.debug(F, message);
  }
                           
  var target = this.determine_post_option_value(options, "target", undefined);
  
  if (target === undefined ||
      target === "" ||
      target === "_self")
  {
    location.href = url;
  }
  else
  if (target === "_parent")
  {
  	if (window.parent)
      window.parent.location.href = url;
    else
      location.href = url
  }
  else
  if (target === "_top")
  {
  	if (window.parent)
      window.parent.location.href = url;
    else
      location.href = url
  }
  else
  if (target === "_blank")
  {
  	window.open(url, "_blank");
  }
  else
  {
  	window.open(url, target);
  }
   
  return false;
          
} // end method



// -------------------------------------------------------------------------------
// handle basic grid sorting within specified container
// watchfrog #171

dtack_page_base_c.prototype.initialize_fulfillment_sort = function(container_id, current_sort_field, current_sort_order, options)
{
  var F = "dtack_page_base_c::initialize_container_sort";

  var that = this;
                                        // parent container we are working in
  $container = $("#" + container_id);
  
  if ($container.length == 0)
  {
    this.debug(F, "cannot initialize grid sort in \"" + container_id + "\"  because container not found");
    return;
  }
  
  $sort_fields = $(".T_sortable", $container);
  if ($sort_fields.length == 0)
  {
    this.debug(F, "cannot initialize grid sort in \"" + container_id + "\" because no T_sortable elements");
    return;
  }
  
  $current_sort_field = $("#" + current_sort_field, $container);
  if (current_sort_field.length == 0)
  {
    this.debug(F, "cannot initialize grid sort in \"" + container_id + "\" because no current sort field with id \"" + current_sort_field + "\"");
    return;
  }

                                        // highlight the current sort field
  $current_sort_field.addClass("T_current_sort_field");
  
  var symbol = current_sort_order == "ascending"? "+": "-";
  $current_sort_field.append(symbol);
  
                                        // action to be taken for each sort button within the container
  $sort_fields.click(
    function(jquery_event_object)
    {
      
      //alert("clicked #" + jquery_event_object.target.id);
      that.post_simple(
        {
          "command": container_id + "_sort_field",
          "arguments": jquery_event_object.target.id
		}
	  );
	}
  );
  
} // end function

// -------------------------------------------------------------------------------
// initialize a tied records collection for the given tableschema name
// there can only be one instance of tied records per tableschema name
// we keep the collection indexed by tableschema name
// this method is typically called in the create_tied_record_prompt where the Create button also lives
// see projx__library__fulfillment__tied_records_base_c
// caller must provide a model record with values to be submitted when inserting a new record
// watchfrog #203

dtack_page_base_c.prototype.initialize_tied_records = function(tableschema_name, table_id, model_record, options)
{
  var F = "dtack_page_base_c::initialize_tied_records";

  var that = this;
  
  var tied_records = this.tied_records_collection[tableschema_name];
  
  if (tied_records === undefined)
  {
    this.debug_verbose(F, "initializing tied records for tableschema " + this.vts(tableschema_name) + 
      " on table #" + table_id +
      " with options[list_order_where] " + this.vts(this.option_value(options, "list_order_where")));
    
    this.assert(F, "model record not being provided", model_record !== undefined);
    this.assert(F, "model record not an array", model_record.length !== undefined);
  
    tied_records = new dtack_page_tied_records_c(this);
  
    tied_records.initialize(tableschema_name, table_id, model_record, options);
  
    this.tied_records_collection[tableschema_name] = tied_records;
  }
  else
  {
  	this.debug_verbose(F, "already initialized tied records for \"" + tableschema_name + "\"");
  }
  
  return tied_records;
  
} // end function
                                                        

// -------------------------------------------------------------------------------
// create a new tied record for the given tableschema_name
// also add to DOM by cloning the model row

dtack_page_base_c.prototype.create_tied_record = function(tableschema_name, options)
{
  var F = "dtack_page_base_c::create_tied_record";

  var $new_row = null;
  
  var tied_records = this.tied_records_collection[tableschema_name];
  
  if (tied_records === undefined)
  {
    this.debug(F, "no initialized tied record collection for \"" + tableschema_name + "\"");
  }
  else
  {
    this.debug_verbose(F, "creating tied record for \"" + tableschema_name + "\" " + this.option_keys_text(options));
    
  	$new_row = tied_records.create(options);
  	
  }
                                        // return the new row to the caller for populating if desired
  return $new_row;
  
} // end function
                                      
                                      
                                      
                                      

// -------------------------------------------------------------------------------
// initialize a tied records collection for the given tableschema name
// there can only be one instance of tied records per tableschema name
// we keep the collection indexed by tableschema name
// this method is typically called in the create_tied_record_prompt where the Create button also lives
// see projx__library__fulfillment__tied_records_non_ajax_base_c
// copied this routine from dtack_javascript permix_global release 1.1
// eztask #15567 restore legacy non-ajax tied record functionality into base libraries for fd100 to continue to use it
// removed instance variable tied_records_non_ajax_collection 
// since there are methods in other classes accessing this is a public instance variable
// eztask #15808 Flood trunk not working for add-another address in 2-applicant/10-bucket/application

dtack_page_base_c.prototype.initialize_tied_records_non_ajax = function(tableschema_name, table_id, options)
{
  var F = "dtack_page_base_c::initialize_tied_records_non_ajax";

  var that = this;
  
  var tied_records_non_ajax = this.tied_records_collection[tableschema_name];
  
  if (tied_records_non_ajax === undefined)
  {
    this.debug(F, "initializing non_ajax tied records for \"" + tableschema_name + "\"");
  
    tied_records_non_ajax = new dtack_page_tied_records_non_ajax_c(this);
  
    tied_records_non_ajax.initialize(tableschema_name, table_id, options);
  
    this.tied_records_collection[tableschema_name] = tied_records_non_ajax;
  }
  else
  {
      this.debug(F, "already initialized tied records for \"" + tableschema_name + "\"");
  }
  
} // end function
                                                        

// -------------------------------------------------------------------------------
// create a new tied record for the given tableschema_name
// also add to DOM by cloning the model row

// renamed this method from this (which was a duplicate of one above)
//dtack_page_base_c.prototype.create_tied_record = function(tableschema_name, options)
// eztask #15701 add-another spreadsheet record (item or expense) fails due to change made to base javascript in favor of fd100
dtack_page_base_c.prototype.create_tied_record_non_ajax = function(tableschema_name, options)
{
  var F = "dtack_page_base_c::create_tied_record_non_ajax";

  var $new_row = null;
  
  var tied_records_non_ajax = this.tied_records_collection[tableschema_name];
  
  if (tied_records_non_ajax === undefined)
  {
    this.debug(F, "no initialized non_ajax tied record collection for \"" + tableschema_name + "\"");
  }
  else
  {
    this.debug(F, "creating tied record for \"" + tableschema_name + "\"");
    
      $new_row = tied_records_non_ajax.create(options);
      
  }
                                        // return the new row to the caller for populating if desired
  return $new_row;
  
} // end function
                                                     
                                                     
                                                     
                                                     
                                                     
                                                                                                          
// -------------------------------------------------------------------------------
// originally written for permix (email the reviewer, aka request project cancel)
// didn't work in Safari

dtack_page_base_c.prototype.mailto = function(options)
{
  var F = "dtack_page_base_c::mailto";
  
                                        // we are being given an event?
  if (options.jquery_event_object != undefined)
  {                 
     options.jquery_event_object.stopPropagation();
     options.jquery_event_object.stopImmediatePropagation();
     options.jquery_event_object.preventDefault();
  }                      
  
  var href = "mailto:";
  var arguments = "";

  this.assert(F, "\"mailto_to\" option not being provided", options["mailto_to"]);
  href += options["mailto_to"];
  
  if (options["mailto_cc"])
    arguments += (arguments? "&": "?") + "cc=" + options["mailto_cc"];
  
  if (options["mailto_subject"])
    arguments += (arguments? "&": "?") + "subject=" + options["mailto_subject"];
  
  if (options["mailto_body"])
    arguments += (arguments? "&": "?") + "body=" + options["mailto_body"];
  
  if (arguments)
    href += "?" + arguments.substring(1);
    
                                        // try to find if we already have the invisible A tag     
  var $a = $("A#dtack_page_base_mailto");
  
                                        // don't already have the invisible A tag?
  if ($a.length == 0)
  {
	                                    // append the button just to the body
	var $container = $("BODY");
  	var style = "display: none;";
  	
  	                                    // caller is giving the button option (this is for debug, to see the A tag near the button)
  	if (options["mailto_button"])
  	{
  	  var $button = $(options["mailto_button"]).closest("DIV");
  	  
  	                                    // and the button exists inside some div?
  	  if ($button.length > 0)
  	  {
  	  	                                // append the invisible A tag in the button's containing div
  	    $container = $button;
  	    style = "";
	  }
	}
	                                    // make the invisible A tag DOM element
  	$container.append("<a id=\"dtack_page_base_mailto\" style=\"" + style + "\" href=\"" + href + "\">MAILTO</a>");
  	
  	                                    // reference the new invisible A tag
    $a = $("A#dtack_page_base_mailto");
  }
  else
  {
  	$a.attr("href", href);
  }
  
  this.assert(F, "tag not found", $a.length > 0);
  
  $a[0].click();
  
  return false;

} // end function
                                                     
// -------------------------------------------------------------------------------
// convert the old-style javascript:goto and javascript_command buttons to global_page_object.jump
// eztask #13160: back button on any admin generics.php gives javascript error to unknown function _goto

dtack_page_base_c.prototype.convert_projx_generic_buttons = function(options)
{
  var F = "dtack_page_base_c::convert_projx_generic_buttons";
  
  var that = this;
  
  var goto_pattern = /^javascript:_goto[(]["](.+)["][)]$/;
  $(".dttoolbar_button").each(
    function()
    {
      var href = $(this).attr("href");
      var info;
      if (info = href.match(goto_pattern))
	  {
	  	that.debug(F, "found match for href \"" + href + "\"");
	  	$(this).click(
	  	  function(jquery_event_object)
	  	  {
	  	  	jquery_event_object.preventDefault();
	  	  	that.jump(
	  	  	  {
	  	  	  	url: info[1],
	  	  	  	target_shift: "_blank",
	  	  	  	jquery_event_object: jquery_event_object
			  }
	  	  	);
		  }
	  	)
	  }
	  else
	  {
	  	that.debug(F, "no match for href \"" + href + "\"");
	  }
	}
  );
  
    
} // end function

          

// -------------------------------------------------------------------------------
// this is makes the checkboxes only allow one per row to be checked

dtack_page_base_c.prototype.activate_radioboxes = function($checkboxes_table, options)
{
  var F = "dtack_page_base_c::activate_radioboxes";
  
  if ($checkboxes_table.length == 0)
    return;
    
  $checkboxes = $("INPUT[type=checkbox]", $checkboxes_table);

  this.debug(F, "found " + $checkboxes.length);
  
  var that = this;
  
  $checkboxes.click(
    function()
    {
      that.debug(F, "checkbox checked is now " + $(this).prop("checked"));
      
      if ($(this).prop("checked"))
      {
      	var $mini_table = $(this).closest("TABLE");
      	var $selector_group_row = $mini_table.closest("TR");
      	var $others = $selector_group_row.find("INPUT[type=checkbox]");
      	that.debug(F, "found " + $mini_table.length + " mini table");
      	that.debug(F, "found " + $selector_group_row.length + " $selector_group_row");
      	that.debug(F, "found " + $others.length + " others on the same row");
      	$others.not($(this)).prop("checked", false);
	  }
	  else
	  {
        $(this).prop("checked", true);
	  }
	}
  );
   
} // end function
  
  
                       
// -------------------------------------------------------------------------------
// render occurrences packets as initially collapsed, with click handerl to expand them

dtack_page_base_c.prototype.collapse_occurrence_grid_row_packets = function(options)
{
  var F = "dtack_page_base_c::collapse_occurrence_grid_row_packets";
  var F = "dtack_page_base_c::collapse_occurrence_grid_row_packets";
  
  var $container = $(".T_occurrence_packet");
  
  var $packets = $("TD.label.packet_name > DIV", $container);
  
  $packets.addClass("dtack_collapsible");
  $packets.addClass("T_with_icon");
  
  $packets.click(function()
    {
      if ($(this).hasClass("T_is_collapsed"))
      {
      	$(this).removeClass("T_is_collapsed");
      	$(this).parent().next("TD").show();
	  }
	  else
	  {
      	$(this).addClass("T_is_collapsed");
      	$(this).parent().next("TD").hide();
	  }
	}
  );

  $packets.addClass("T_is_collapsed");
  $packets.parent().next("TD").hide();
  $container.each(
    function()
    {
      $("TABLE > TBODY > TR > TD", $(this)).first().next().show();
	}
  );

} // end function  


// -------------------------------------------------------------------------------
// if section has no items, then replace its guts with a copy of another DIV

dtack_page_base_c.prototype.replace_empty_section_with_message = function(
  debug_identifier,
  $section_container, 
  $replacement,
  $meaningful_items)
{
  var F = "dtack_page_base_c::replace_empty_section_with_message";
  
  if ($meaningful_items.length !== 0)
  {
  	this.debug(F, debug_identifier + " has " + $meaningful_items.length + " meaningful items");
  }
  else
  if ($section_container.length === 0)
  {
  	this.debug(F, "empty " + debug_identifier + " has " + "no section_container");
  }
  else
  if ($replacement !== null && $replacement.length === 0)
  {
  	this.debug(F, "empty " + debug_identifier + " has " + "no replacement");
  }
  else
  {
    if ($replacement !== null)
      $section_container.html($replacement.html());
    else
      $section_container.hide();
  }

} // end function  

// -------------------------------------------------------------------------------
// this is called when the dtack autocomplete composer changes
// the change() listener attachment to this method is composed by c#

dtack_page_base_c.prototype.handle_DTACK__COMPOSER__AUTOCOMPLETE__CHANGED = function(details_object)
{
  var F = "dtack_page_base_c::handle_DTACK__COMPOSER__AUTOCOMPLETE__CHANGED";

  var $autocomplete = details_object.$autocomplete;
  var submittable_id = $autocomplete.attr("id").replace(/_autocomplete/, "");
  
                                        // eztask #15231 Safari: data validation for nonblank on autocomplete field not working
  var $submittable = $("[id='" + submittable_id + "']");
  var ui = details_object.ui;
  
  if (ui.item)
  {
    this.debug_verbose(F, "seeing change from selected item on " + submittable_id + " ui.item.stored is " + ui.item.stored);
    
    $submittable.val(ui.item.stored);
    
                                        // this will cause a add_to_posted_change_list2 if the field is desired
                                        // it won't be desired in filters, for example
    $submittable.change();
    
    // don't automatically post as a change since this will enlist it in confirm_unsaved_changes 
    // eztask #14618: Appears the auto-complete filters are causing the you have unsaved changes... alert to pop
    //this.add_to_posted_change_list2($submittable.attr("name"), this.POSTED_CHANGE_ACTION_CHANGED);
  }
  else
  {
    this.debug_verbose(F, "seeing change from typing (not selecting) on " + submittable_id);
  
    $autocomplete.val("");
    
    $submittable.val("");
    
    $submittable.change();

    //this.add_to_posted_change_list2($submittable.attr("name"), this.POSTED_CHANGE_ACTION_CHANGED);
  }

} // end function  

// -------------------------------------------------------------------------------
// this is called when the dtack checkbox composer changes
// the change() listener attachment to this method is composed by c#

dtack_page_base_c.prototype.handle_DTACK__COMPOSER__CHECKBOX__CHANGED = function(details_object)
{
  var F = "dtack_page_base_c::handle_DTACK__COMPOSER__CHECKBOX__CHANGED";

  var $checkbox = details_object.$checkbox;
  var submittable_id = $checkbox.attr("id").replace(/_checkbox/, "");
  
  var $submittable = $("[id='" + submittable_id + "']");
  
  this.debug(F, "seeing change on " + submittable_id + " checked is " + $checkbox.prop("checked") +
    ($submittable.count == 0? ", did not find submittable": ", found submittable") + " " + submittable_id);
    
  if ($checkbox.prop("checked"))
  {
    $submittable.val("1");
  }
  else
  {
    $submittable.val("0");
  }
    
                                        // this will cause a add_to_posted_change_list2 if the field is desired
                                        // it won't be desired in filters, for example
  $submittable.change();

} // end function  

        
// -------------------------------------------------------------------------------
// activate the database tableschema option clicks (such as is_config, is_log, etc)

dtack_page_base_c.prototype.activate_tableschema_options = function()
{
  var F = "dtack_page_base_c::activate_tableschema_options";

  this.activate_tableschema_option("is_config");
  this.activate_tableschema_option("is_log");
  this.activate_tableschema_option("is_smartsync");
  this.activate_tableschema_option("is_lookup");
  this.activate_tableschema_option("is_enduser");
  this.activate_tableschema_option("is_mailswarm");

} // end function  
                                                 
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.activate_tableschema_option = function(option_name)
{
  var F = "dtack_page_base_c::activate_tableschema_option";

  var $tableschema_options = $(".dtack_environment.T_tableschema .T_option.T_label.T_" + option_name);
  
  this.debug_verbose(F, "activating " + $tableschema_options.length + " for " + option_name);
  
  var that = this;
  
  $tableschema_options.click(
    function()
    {
      that.set_all_tableschema_options_like($tableschema_options, $(this));
    }
  );

} // end function  
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.set_all_tableschema_options_like = function($tableschema_options, $tableschema_option)
{
  var F = "dtack_page_base_c::set_all_tableschema_options_like";

  var $checkbox = $tableschema_option.parent().parent().children("INPUT");
  var checked = $checkbox.prop("checked")
  this.debug_verbose(F, "click checked " + checked);
  $tableschema_options.each(function() {var $checkbox = $(this).parent().parent().children("INPUT"); $checkbox.prop("checked", checked);});

} // end function       

            
// -------------------------------------------------------------------------------
// move a standard toolbar button to an area at the bottom
// eztask #15845 SAT: BMP image upload not working (Martin) 

dtack_page_base_c.prototype.move_top_toolbar_button_to_bottom = function($button, bottom_id)
{
  var F = "dtack_page_base_c::move_top_toolbar_button_to_bottom";       
  
  var $bottom = $("#" + bottom_id);
                                       
                                       // the button is there but no bottom area found to move it to?
  if ($button.length > 0 && $bottom.length == 0)
  {
                                       // hide the original button
    $button.parent().hide();
  }
  else
  if ($button.length > 0 && $bottom.length > 0)
  {
    var $button_td = $button.parent();
    
    var $tr = $bottom.find("TR").first();
    if ($tr.length == 0)
    {
      $bottom.append("<table><tr></tr></table>");
      $tr = $bottom.find("TR").first();
    }
    
    $tr.append($button_td);
  
  }
  
} // end function  