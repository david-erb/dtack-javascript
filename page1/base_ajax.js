// --------------------------------------------------------------------
// class representing the page being viewed in the browser
// methods relating to ajax on on the page

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.initialize_ajax = function(selector, options)
{
  var F = "initialize_ajax";

  var that = this;
  
  this.debug_verbose(F, "initializing ajax on " + this.vts(selector));
  
  var $selector = $(selector);
      
  var $text_selectors = $("TEXTAREA,INPUT:TEXT", $selector);
  $text_selectors.change(
    function(jquery_event_object) 
    {  
      that.update_record_value(jquery_event_object.target, options);
    }
  );
  
  var $select_selectors = $("SELECT", $selector);
  $select_selectors.change(
    function(jquery_event_object) 
    {  
      that.update_record_value(jquery_event_object.target, options);
    }
  );
                                                                
  var $radio_selectors = $("INPUT:RADIO", $selector);
  $radio_selectors.change(
    function(jquery_event_object) 
    {  
      that.update_record_value(jquery_event_object.target, options);
    }
  );
  
  var $checkbox_selectors = $("INPUT:CHECKBOX", $selector);
  $checkbox_selectors.change(
    function(jquery_event_object) 
    {  
      that.update_record_checkbox(jquery_event_object.target, options);
    }
  );
                                        // group of all selectors from the above selections
  var $all_selectors;
  $all_selectors = $text_selectors.add($select_selectors);
  $all_selectors = $all_selectors.add($radio_selectors);
  
                                        // fix problem with ajax detecting field changes on shadow checkboxes
                                        // watchfrog #225
  //$all_selectors = $all_selectors.add($checkbox_selectors);
  
                                        // checkboxes in a relation will all have the same name, but different texts
                                        // this means the same name might be repeated in the selectors (which is ok)
  $all_selectors.each(
    function(index, element) 
    {
      //that.debug(F, "expecting ajax on " + element.name);
      that.add_to_posted_change_list2(element.name, that.POSTED_CHANGE_ACTION_AJAX_EXPECTED);
    });
  
  $text_selectors.each(
    function(index, element) 
    {
                                        // don't double-add text and checkboxes to posted fields
                                        // watchfrog #208 
      //that.add_to_posted_change_list2(element.name, that.POSTED_CHANGE_ACTION_AJAX_EXPECTED);
                                        // for short
      var posted_change_item = that.posted_change_list[element.name];
      
      try
      {
        posted_change_item.data_entry_field = new dtack__data_entry__text_c(dtack_environment, element);
	  }
	  catch(exception)
      {
	  }
      
    });
  
  $select_selectors.each(
    function(index, element) 
    {
                                        // for short
      var posted_change_item = that.posted_change_list[element.name];
      
      try
      {
        posted_change_item.data_entry_field = new dtack__data_entry__select_c(dtack_environment, element);
	  }
	  catch(exception)
      {
	  }
      
    });
  
                                        // checkboxes in a relation will all have the same name, but different texts
                                        // this means the same name might be repeated in the selectors (which is ok)
  $checkbox_selectors.each(
    function(index, element) 
    {
      var element_name = element.name;
      
      if (element_name.substring(0, 7) == "shadow_")
        element_name = element_name.substring(7);
        
                                        // fix problem with ajax detecting field changes on shadow checkboxes
                                        // watchfrog #225
      that.add_to_posted_change_list2(element_name, that.POSTED_CHANGE_ACTION_AJAX_EXPECTED);
      
                                        // for short
      var posted_change_item = that.posted_change_list[element_name];

      that.debug(F, "expecting ajax on CHECKBOX " + element_name);
      
      try
      {
      	                                // add data_entry attributes for checkboxes
      	                                // watchfrog #209
        posted_change_item.data_entry_field = new dtack__data_entry__checkbox_c(dtack_environment, element);
	  }
	  catch(exception)
      {
	  }
      
    });
    
  this.debug_verbose(F, "initialized ajax on " + 
    $checkbox_selectors.length + " checkbox selector(s), " +
    $radio_selectors.length + " radio selector(s), " +
    $text_selectors.length + " text selector(s), " +
    $select_selectors.length + " select selector(s), " +
    " which is " + $all_selectors.length + " total selector(s), ");
  
} // end function
                                                        

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_record_checkbox = function(target, options)
{
  var F = "dtack_page_base_c::update_record_checkbox";
                                        // don't update record from checkboxes with no name attribute
  if (!target.name)
    return;
    
  var parts = this.extract_id_and_field_parts(target.name);
  
  if (parts.table_name == "")
  {
  	this.warn_about_ajax_failure("unable to parse the parts of target field name \"" + target.name + "\"");
  }
  else
  {
    var value = target.value;
    if (!target.checked)
    {
      var new_value = parseInt(value);
      if (!isNaN(new_value))
      {
      	value = -new_value;
      	value = value.toFixed(0);
	  }
	  else
	  {
        value = "-" + value;
	  }
	}

//    this.debug(F, "ajax_updating_record ajax" +
//      " from \"" + target.name + "\"" +
//      " which is table \"" + parts.table_name + "\"," +
//      " field \"" + parts.field_name + "\"," +
//      " autoid \"" + parts.autoid + "\"," +
//      " value \"" + value + "\"");
                                        // look for the tabularium-assigned special 'composer relation'
                                        // this put there by c# and is an older technique
                                        // the data_entry approach is newer and should be used in the future instead
    var dtcomposer_relation = $(target).attr("dtcomposer_relation");
    if (dtcomposer_relation == undefined)
      dtcomposer_relation = $(target).prop("dtcomposer_relation");
      
                                        // newer c# encodes the relation information differently still
                                        // encoded not on the checkbox but on the containing TD
                                        // not sure, but data_entry classes handle it in the same way
    if (dtcomposer_relation == undefined)
      dtcomposer_relation = $(target).closest(".dtproperty_checkbox_td").attr("data-dtproperty-storage_formatter");
      
//    this.debug(F, "dtcomposer_relation is " + this.vts(dtcomposer_relation));
    
    if (dtcomposer_relation != undefined)
    {
      var composer_parts = dtcomposer_relation.split("|");
      var storage_formatter = composer_parts[0];
    
      if (storage_formatter == "relation" &&
          composer_parts.length == 2)
      {
        var storage_default = composer_parts[1];
        composer_parts = storage_default.split(",");
        
        if (composer_parts.length == 3)
        {
          var relation_table_name = composer_parts[0];
          var relation_rhs = composer_parts[2];
    
                                        // special format for sending a relation change is:
                                        // <tableschema_name>patients.scut_labs_done:patient__scut_labs_done</tableschema_name>
                                        // <fieldschema_name>rhs</fieldschema_name>
                                        // <autoid>10</autoid>
                                        // <value>1</value>
                                        // presumes relation lhs field is "lhs"
                                        // value is the rhs value in the relation and gets added to the csv list in the primary table
                                        // a negative value means remove the relation and take it out of the csv list
          parts.table_name += "." + parts.field_name;
          parts.table_name += ":" + relation_table_name;
          parts.field_name = relation_rhs;
	    }
	  }
    }
  
    this.update_record(
      target.name,
      parts.table_name,
      parts.field_name,
      parts.autoid,
      value,
      options);
  }
  
} // end function
                        
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_record_value = function(target, options)
{
  var F = "update_record_value";
    
  var formatted_value = target.value;
  
                                        // parse the name
  var parts = this.extract_id_and_field_parts(target.name);
  
                                        // parse of the name failed?
  if (!parts.table_name || 
      !parts.field_name ||
      !parts.autoid)
  {
                                        // try the id
                                        // watchfrog #193
    parts = this.extract_id_and_field_parts(target.id);
  }
  
//  this.debug(F, "ajax_updating_record ajax" +
//    " from \"" + target.name + "\"" +
//    " which is table \"" + parts.table_name + "\"," +
//    " field \"" + parts.field_name + "\"," +
//    " autoid \"" + parts.autoid + "\"," +
//    " value \"" + value + "\"");
  
                                        // parse of name and id failed?
  if (!parts.table_name || 
      !parts.field_name ||
      !parts.autoid)
  {
  	this.warn_about_ajax_failure("unable to parse the parts of target field name \"" + target.name + "\" and id \"" + target.id + "\"");
  }
  else
  {
    this.update_record(
      target.name,
      parts.table_name,
      parts.field_name,
      parts.autoid,
      target.value,
      options);
  }
    
} // end function
                                                                                   
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.peek_data_entry_attribute = function(target_name, attribute_name, default_value)
{
  var F = "peek_data_entry_attribute";
  
  var attribute_value = default_value;
  
  var posted_change_item = this.posted_change_list[target_name];

                                        // a posted change item exists for the field's name?
                                        // this is typically done by dtack_page_base_c::initialize_ajax()
  if (posted_change_item)
  {
  	                                    // a data_entry item has been created for this field?
  	                                    // also typically done by dtack_page_base_c::initialize_ajax(), but not for every type of input field
    var data_entry_field = posted_change_item.data_entry_field;
    if (data_entry_field)     
    {
      this.debug_verbose(F, "target name \"" + target_name + "\" has posted_change_item.data_entry_field[" + attribute_name + "] \"" + data_entry_field[attribute_name] + "\"");
      attribute_value = data_entry_field[attribute_name];
      if (attribute_value === undefined)
        attribute_value = default_value;
	}
	else
	{
      this.debug_verbose(F, "target name \"" + target_name + "\" has no posted_change_item.data_entry_field");
	}
  }
  else
  {
    this.debug_verbose(F, "target name \"" + target_name + "\" has no posted_change_item");
  }
    
  return attribute_value;
} // end function
                                                        

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_record = function(field_name, tableschema_name, fieldschema_name, autoid, value, options)
{
  var F = "update_record";
 
  if (this.update_record_ajax_issuer !== undefined ||
      this.ajax_issuer !== undefined)
  {
    this.update_record_xml(field_name, tableschema_name, fieldschema_name, autoid, value, options);
  }
  else
  {
    this.update_record_json(field_name, tableschema_name, fieldschema_name, autoid, value, options);
  }

} // end method

// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_record_xml = function(field_name, tableschema_name, fieldschema_name, autoid, value, options)
{
  var F = "update_record_xml";
    
  var storage_formatter = this.peek_data_entry_attribute(field_name, "storage_formatter", null);
  var storage_default = this.peek_data_entry_attribute(field_name, "storage_default", null);
  
                                        // newer code (ca. December 2017) uses this name in preference
  var ajax_issuer = this.update_record_ajax_issuer;
  
  if (!ajax_issuer)
  {
    this.debug_verbose(F, "no instance variable this.update_record_ajax_issuer so using this.ajax_issuer");
    ajax_issuer = this.ajax_issuer;
  }
  else
  {
    this.debug_verbose(F, "found instance variable this.update_record_ajax_issuer so using it");
  }
    
  ajax_issuer.issue_command(
    "update_record", 
    "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
    "<fieldschema_name>" + fieldschema_name + "</fieldschema_name>" +
    "<autoid>" + autoid + "</autoid>" +
    "<value>" + this.dtack_environment.escape_xml(value) + "</value>" +
    (storage_formatter === null? "": "<storage_formatter>" + storage_formatter + "</storage_formatter>") +
    (storage_default === null? "": "<storage_default>" + storage_default + "</storage_default>"),
    null, 
    null, 
    options);

} // end method
                                    
// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.update_record_json = function(field_name, tableschema_name, fieldschema_name, autoid, value, options)
{
  var F = "update_record_json";
 
  var xml = 
    "<request>" +
    "<command action=\"update_value\">" +
    "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
    "<fieldschema_name>" + fieldschema_name + "</fieldschema_name>" +
    "<autoid>" + autoid + "</autoid>" +
    "<value>" + this.dtack_environment.escape_xml(value) + "</value>" +
    "</command>" +
    "</request>";
    
  //this.debug(F, xml);
                                                                             
                                        // keep track of fields that have been changed by ajax
  this.add_to_posted_change_list2(field_name, this.POSTED_CHANGE_ACTION_AJAX_STARTED);
  
  var that = this;
                                        // instantiate a new ajax object
  var ajax_object = new dtack_ajax2_c(dtack_environment);
  
  ajax_object.field_name = field_name;
  ajax_object.tableschema_name = tableschema_name;
                                              
                                        // specify the handler to be called when the request finishes
  ajax_object.attach_trigger(
    "finished", 
    function(triggered_object)
    {
	  that.handle_update_record_finished(triggered_object);
	});

                                        // post the xml from the textarea to the url specified in the text box
  ajax_object.post(
    "../../ajax/update_record/page.aspx?persist_id=" + dtack_environment.settings.host.persist_id,
    xml);
    
  // don't use this "fake post", it can't handle ampersands it the xml
  //"&post=" + xml);

} // end method
  
// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_page_base_c.prototype.handle_update_record_finished = function(ajax_object)
{
  var F = "handle_update_record_finished";
  
                                          // check response from an update_record ajax, return just the response object from within the json structure
  var response = this.check_update_record_response(ajax_object);
  
  if (response !== null)
  {
  	                                    // record the modified timestamp for the tableschema in the response
	this.store_modified_ts(response);
  }
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// ----------------------------------------------------------------------------
// check response from an update_record ajax, return just the response object from within the json structure

dtack_page_base_c.prototype.check_update_record_response = function(ajax_object)
{
  var F = "check_update_record_response";
  
                                          // stuff the raw values into the display
  //this.debug("ajax finished with code: " + ajax_object.http_code);

  var http_code = parseInt(ajax_object.http_code, 10);

  if (isNaN(http_code))
  {
  	this.warn_about_ajax_failure("your last change wasn't saved on the server: the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code == 0)
  {
  	//this.update_status("page is unloading");
  }
  else
  if (http_code != 200)
  {
    this.warn_about_ajax_failure("unexpected http code " + http_code);
  }
  else
  {
  	var json = undefined;
                            
  	
	try
	{
									// the body should be a json object definition
	  eval("json = {" + ajax_object.http_body + "};");
	}
									/* could not parse the response? */
	catch(exception)
	{
	  var message; 
	  if (exception.name != undefined)
		message = exception.name + ": " + exception.message;
	  else
		message = exception;
		
	  message = "invalid response: " + message;

	  json = {"response": 
	    {
	      "exceptions":
	      {
	      	"count": 1,
	      	"exception":
	      	{
	      	  "phase": "json",
	      	  "message": message,
	      	  "stacktrace": exception.stacktrace
			}
		  }
		}
	  };
	  
	}
	
	if (json == undefined)
	{
	  this.warn_about_ajax_failure("no json provided in ajax response");
	}
	else
	if (json.response == undefined)
	{
	  this.warn_about_ajax_failure("no json.response provided by server");
	}
	else
	if (json.response.exceptions == undefined)
	{
	  this.warn_about_ajax_failure("no json.response.exceptions provided by server");
	}
	else
	if (json.response.exceptions.count == undefined)
	{
	  this.warn_about_ajax_failure("no json.response.exceptions.count provided by server");
	}
	else
	if (json.response.exceptions.count > 0)
	{
	  var warning = "";
	  for (var k in json.response.exceptions)
	  {
	  	if (k == "count")
	  	  continue;
	  	  
	  	var exception = json.response.exceptions[k];
	  	
	  	if (exception.phase == "authorize")
	  	{
	  	  warning += "your last change wasn't saved on the server: there was an authorization failure";
		}
		else
		{
  	  	  warning += "phase: " + exception.phase + "\n";
	  	  warning += "message: " + exception.message + "\n";
	  	  warning += "stacktrace:\n" + exception.stacktrace + "\n";
		}
	  }
	  this.warn_about_ajax_failure(warning);
	}
    else
    if (json.response.tableschema_name === undefined)
    {
      this.warn_about_ajax_failure("no json.response.tableschema_name provided by server");
    }
    else
    if (json.response.modified_ts === undefined)
    {
      this.warn_about_ajax_failure("no json.response.modified_ts provided by server");
    }
    else
    {
                                        // keep track of fields that have been changed by ajax
      this.add_to_posted_change_list2(ajax_object.field_name, this.POSTED_CHANGE_ACTION_AJAX_SUCCEEDED);
      
      return json.response;
	}
  }

  this.add_to_posted_change_list2(ajax_object.field_name, this.POSTED_CHANGE_ACTION_AJAX_FAILED);
  
  return null;
                                 
} // end method





// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.handle_click_delete_row_autoid = function(event, options)
{
  var F = "delete_record_clicked";
  
  var $target = $(event.currentTarget);

  $target.closest("TR").remove();
  
  var parts = this.extract_id_parts($target.attr("id"));
  
  this.delete_record(parts.table_name, parts.autoid, options);

} // end method




// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.delete_record = function(tableschema_name, autoid, options)
{
  var F = "delete_record";
 
  if (this.ajax_issuer !== undefined)
  {
    this.delete_record_xml(tableschema_name, autoid, options);
  }
  else
  {
    //this.update_record_json(field_name, tableschema_name, autoid, options);
    alert("delete_record_json not implemented");
  }

} // end method



// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.delete_record_xml = function(tableschema_name, autoid, options)
{
  var F = "update_record_xml";
    
  this.ajax_issuer.issue_command(
    "delete_record", 
    "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
    "<autoid>" + autoid + "</autoid>",
    null, 
    null, 
    options);

} // end method




// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.query_modified = function(tableschema_name, autoid, options)
{
  var F = "query_modified";
 
  if (autoid === "")
    return;
   
  var xml = 
    "<request>" +
    "<command action=\"query_modified\">" +
    "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
    "<autoid>" + autoid + "</autoid>" +
    "</command>" +
    "</request>";
  
  var that = this;
                                        // instantiate a new ajax object
  var ajax_object = new dtack_ajax2_c(dtack_environment);
  
                                        // specify the handler to be called when the request finishes
  ajax_object.attach_trigger(
    "finished", 
    function(triggered_object)
    {
	  that.handle_query_modified_finished(triggered_object);
	});

  ajax_object.post(
    "../../ajax/query_modified/page.aspx?persist_id=" + dtack_environment.settings.host.persist_id,
    xml);

} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_page_base_c.prototype.handle_query_modified_finished = function(ajax_object)
{
  var F = "handle_query_modified_finished";
  
                                        // check response from a ajax, return just the response object from within the json structure
  var response = this.check_query_modified_response(ajax_object);
  
  if (response !== null)
  {
	var old_modified_ts = this.fetch_modified_ts(response);
	this.store_modified_ts(response);
	var new_modified_ts = this.fetch_modified_ts(response);
	
  	if (old_modified_ts === "*unset*")
  	{
  	  this.debug(F, response.tableschema_name + " ts initialized to " + new_modified_ts);
      this.pull_triggers(this.CONSTANTS.TRIGGERS.QUERY_MODIFIED_NOCHANGE, this);
	}
	else
  	if (old_modified_ts !== new_modified_ts)
	{
  	  this.debug(F, response.tableschema_name + " ts changed from \"" + old_modified_ts + "\" to " + new_modified_ts);
      this.pull_triggers(this.CONSTANTS.TRIGGERS.QUERY_MODIFIED_DIFFERED, this);
	  this.dtack_environment.define_symbol(symbol_name, new_modified_ts);
	}
	else
	{
  	  //this.debug(F, response.tableschema_name + " ts no change from " + new_modified_ts);
      this.pull_triggers(this.CONSTANTS.TRIGGERS.QUERY_MODIFIED_NOCHANGE, this);
	}
  }
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// ----------------------------------------------------------------------------
// check response from a query_modified ajax, return just the response object from within the json structure

dtack_page_base_c.prototype.check_query_modified_response = function(ajax_object)
{
  var F = "check_query_modified_response";

  var http_code = parseInt(ajax_object.http_code, 10);
  
  if (isNaN(http_code))
  {
  	this.warn_about_ajax_failure(
  	  "unable to access query_modified url:" +
  	  " the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code != 200)
  {
    this.warn_about_ajax_failure("unexpected http code " + http_code);
  }
  else
  {
  	var json = undefined;
  	
	try
	{
									// the body should be a json object definition
	  eval("json = {" + ajax_object.http_body + "};");
	}
									/* could not parse the response? */
	catch(exception)
	{
	  var message; 
	  if (exception.name != undefined)
		message = exception.name + ": " + exception.message;
	  else
		message = exception;
                                    		
	  message = "invalid response: " + message;

	  json = {"response": 
	    {
	      "exceptions":
	      {
	      	"count": 1,
	      	"exception":
	      	{
	      	  "phase": "json",
	      	  "message": message,
	      	  "stacktrace": exception.stacktrace
			}
		  }
		}
	  };
	  
	}
	
	if (json == undefined)
	{
	  this.warn_about_ajax_failure("no json provided in ajax response");
	}
	else
	if (json.response == undefined)
	{
	  this.warn_about_ajax_failure("no json.response provided by server");
	}
	else
	if (json.response.exceptions == undefined)
	{
	  this.warn_about_ajax_failure("no json.response.exceptions provided by server");
	}
	else
	if (json.response.exceptions.count == undefined)
	{
	  this.warn_about_ajax_failure("no json.response.exceptions.count provided by server");
	}
	else
	if (json.response.exceptions.count > 0)
	{
	  var warning = "";
	  for (var k in json.response.exceptions)
	  {
	  	if (k == "count")
	  	  continue;
	  	  
	  	var exception = json.response.exceptions[k];
	  	
	  	if (exception.phase == "authorize")
	  	{
	  	  warning += "unable to poll for simultaneous access: there was an authorization failure";
		}
		else
		{
  	  	  warning += "phase: " + exception.phase + "\n";
	  	  warning += "message: " + exception.message + "\n";
	  	  warning += "stacktrace:\n" + exception.stacktrace + "\n";
		}
	  }
	  this.warn_about_ajax_failure(warning);
	}
    else
    if (json.response.tableschema_name === undefined)
    {
      this.warn_about_ajax_failure("no json.response.tableschema_name provided by server");
    }
    else
    if (json.response.modified_ts === undefined)
    {
      this.warn_about_ajax_failure("no json.response.modified_ts provided by server");
    }
    else
    {
      return json.response;
	}
	
	return null;
  }
                                 
} // end method

// ----------------------------------------------------------------------------

dtack_page_base_c.prototype.store_modified_ts = function(response)
{
  var F = "store_modified_ts";

  if (response.tableschema_name === undefined)
  {
    this.warn_about_ajax_failure("no response.tableschema_name provided in structure");
  }
  else
  if (response.modified_ts === undefined)
  {
    this.warn_about_ajax_failure("no response.modified_ts provided in structure");
  }
  else
  {
	var symbol_name = "dtack_page_base_c.query_modified:" + response.tableschema_name;
	this.dtack_environment.define_symbol(symbol_name, response.modified_ts);
  }
                                 
} // end method

// ----------------------------------------------------------------------------

dtack_page_base_c.prototype.fetch_modified_ts = function(response)
{
  var F = "fetch_modified_ts";
  
  if (response.tableschema_name === undefined)
  {
    this.warn_about_ajax_failure("no response.tableschema_name provided in structure");
  }
  else
  {
    var symbol_name = "dtack_page_base_c.query_modified:" + response.tableschema_name;
    return this.dtack_environment.resolve_symbol(symbol_name, "*unset*");
  }
                                 
} // end method




// -------------------------------------------------------------------------------

dtack_page_base_c.prototype.ack_page = function(tableschema_name, autoid, options)
{
  var F = "ack_page";
 
  if (autoid === "")
    return;
   
  var xml = 
    "<request>" +
    "<command action=\"ack_page\">" +
    "<tableschema_name>" + tableschema_name + "</tableschema_name>" +
    "<autoid>" + autoid + "</autoid>" +
    "</command>" +
    "</request>";
  
  var that = this;
  
  if (this.ack_page_stress_loop_count === undefined)
  {
    this.ack_page_stress_loop_count = 
      parseInt(this.dtack_environment.host_value("development.stress.ack_page.loops", "0"));
    if (isNaN(this.ack_page_stress_loop_count) ||
        this.ack_page_stress_loop_count < 1)
      this.ack_page_stress_loop_count = 1;
      
    if (this.ack_page_stress_loop_count > 1)
      this.debug(F, "ack_page_stress_loop_count is " + this.ack_page_stress_loop_count);
  }
    
  for (var i=0; i<this.ack_page_stress_loop_count; i++)
  {
                                        // instantiate a new ajax object
    var ajax_object = new dtack_ajax2_c(dtack_environment);
  
                                        // specify the handler to be called when the request finishes
    ajax_object.attach_trigger(
      "finished", 
      function(triggered_object)
      {
	    that.handle_ack_page_finished(triggered_object);
	  });

    ajax_object.post(
      "../../../ajax/ack_page/page.aspx?persist_id=" + dtack_environment.settings.host.persist_id,
      xml);
  }
  
} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_page_base_c.prototype.handle_ack_page_finished = function(ajax_object)
{
  var F = "handle_ack_page_finished";
  
                                        // check response from a ajax, return just the response object from within the json structure
  var response = this.check_ack_page_response(ajax_object);
  
  if (this.ack_page_stress_loop_count > 1)
    return; 
  
  if (response !== null)
  {
    if (response.load_count === undefined)
    {
      this.warn_about_ack_page_failure("no response.load_count provided in structure");
    }
    else
    {
      var load_count = parseInt(response.load_count);
      
      if (isNaN(load_count))
	  {
        this.warn_about_ack_page_failure("response.load_count is not an integer");
	  }
	  else
	  {
	  	if (load_count > 1)
	  	{
	  	  alert("BROWSER \"BACK\" OR \"FORWARD\" BUTTON DETECTED\n\n" +
	  	    "Please try to avoid using the browser's \"BACK\" and \"FORWARD\" buttons for this website.\n\n" +
	  	    "You may have unpredictable results.\n\n" +
	  	    "Thank you.");
		}
	  }
    }
  	
  }
                                        // tell ajax we are finished with this conversation 
  ajax_object.finished();
                                 
} // end method

// ----------------------------------------------------------------------------
// check response from a ack_page ajax, return just the response object from within the json structure

dtack_page_base_c.prototype.check_ack_page_response = function(ajax_object)
{
  var F = "check_ack_page_response";

  var http_code = parseInt(ajax_object.http_code, 10);
  
  if (isNaN(http_code))
  {
  	this.warn_about_ack_page_failure(
  	  "unable to access ack_page url:" +
  	  " the server responded with an unexpected http code \"" + ajax_object.http_code + "\"");
  }
  else
  if (http_code != 200)
  {
    this.warn_about_ack_page_failure("unexpected http code " + http_code);
  }
  else
  {
  	var json = undefined;
  	
	try
	{
									// the body should be a json object definition
	  eval("json = {" + ajax_object.http_body + "};");
	}
									/* could not parse the response? */
	catch(exception)
	{
	  var message; 
	  if (exception.name != undefined)
		message = exception.name + ": " + exception.message;
	  else
		message = exception;
                                    		
	  message = "invalid response: " + message;

	  json = {"response": 
	    {
	      "exceptions":
	      {
	      	"count": 1,
	      	"exception":
	      	{
	      	  "phase": "json",
	      	  "message": message,
	      	  "stacktrace": exception.stacktrace
			}
		  }
		}
	  };
	  
	}
	
	if (json == undefined)
	{
	  this.warn_about_ack_page_failure("no json provided in ajax response");
	}
	else
	if (json.response == undefined)
	{
	  this.warn_about_ack_page_failure("no json.response provided by server");
	}
	else
	if (json.response.exceptions == undefined)
	{
	  this.warn_about_ack_page_failure("no json.response.exceptions provided by server");
	}
	else
	if (json.response.exceptions.count == undefined)
	{
	  this.warn_about_ack_page_failure("no json.response.exceptions.count provided by server");
	}
	else
	if (json.response.exceptions.count > 0)
	{
	  var warning = "";
	  for (var k in json.response.exceptions)
	  {
	  	if (k == "count")
	  	  continue;
	  	  
	  	var exception = json.response.exceptions[k];
	  	
	  	if (exception.phase == "authorize")
	  	{
	  	  warning += "unable to check the page load count: there was an authorization failure";
		}
		else
		{
  	  	  warning += "phase: " + exception.phase + "\n";
	  	  warning += "message: " + exception.message + "\n";
	  	  warning += "stacktrace:\n" + exception.stacktrace + "\n";
		}
	  }
	  this.warn_about_ack_page_failure(warning);
	}
    else
    if (json.response.tableschema_name === undefined)
    {
      this.warn_about_ack_page_failure("no json.response.tableschema_name provided by server");
    }
    else
    if (json.response.load_count === undefined)
    {
      this.warn_about_ack_page_failure("no json.response.load_count provided by server");
    }
    else
    {
      return json.response;
	}
	
	return null;
  }
                                 
} // end method

// ----------------------------------------------------------------------------
// called with an ajax had detected any kind of error
// the theory is that failures are pervasive (not sporadic) at the server end
// so no real need for the page to recover and continue
// we just keep reporting each one as it happens with an alert

dtack_page_base_c.prototype.warn_about_ack_page_failure = function(details)
{
  var F = "warn_about_ack_page_failure";
  
  this.debug(F, details);
  
  //this.alert_about_ajax_failure(details);
  
} // end method

// ----------------------------------------------------------------------------
// called with an ajax had detected any kind of error
// the theory is that failures are pervasive (not sporadic) at the server end
// so no real need for the page to recover and continue
// we just keep reporting each one as it happens with an alert

dtack_page_base_c.prototype.warn_about_ajax_failure = function(details)
{
  
  //this.dialog_about_ajax_failure(details);
 
  this.alert_about_ajax_failure(details);
  
} // end method

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request

dtack_page_base_c.prototype.alert_about_ajax_failure = function(details)
{
  var date = new Date();
  
  var message = 
    "Server Communications Failure\n\n" +
    "There has been an error communicating with the server.\n\n" +
    "The auto-save is no longer working, so changes you make on this page will not be saved.\n" +
    "Concurrent changes being made to data on this page by other users are not being tracked.\n\n" +
    "You can try to move to another page and continue your work.\n" +
    "If this error continues on other pages, please contact Technical Support.\n\n" +
    "Here are some details:\n" +
    "time: " + date.toString() + "\n" +
    details;
  
  alert(message);
  
} // end method

// -------------------------------------------------------------------------------
// THIS IS NOT YET TESTED!!!

dtack_page_base_c.prototype.dialog_about_ajax_failure = function(details)
{
  var F = "dialog_about_ajax_failure";

  var $ajax_failure_dialog_contents = $("#ajax_failure_dialog_contents");
  
  if ($ajax_failure_dialog_contents.length == 0)
    return false;
    
  if (this.ajax_failure_miniwindow == undefined)
  {
  	this.ajax_failure_miniwindow = new dtack_miniwindow_dialog_c(this);
  	this.ajax_failure_miniwindow.initialize();
  }
  
  this.ajax_failure_miniwindow.show_near(
    $ajax_failure_dialog_contents, 
    $(window),
    {
      "method": "move",
      "my": "center center",
      "at": "center center",
      "width": 640
	});

} // end function