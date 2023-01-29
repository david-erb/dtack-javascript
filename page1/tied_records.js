// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack_page_tied_records_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_page_tied_records_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_page_tied_records_c.prototype.constructor = dtack_page_tied_records_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_page_tied_records_c(page_object, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_page_tied_records_c";

										/* call the base class constructor helper */
	dtack_page_tied_records_c.prototype.base.constructor.call(
	  this,
	  page_object.dtack_environment,
	  classname != undefined? classname: F);

	this.push_class_hierarchy(F);
  }

  this.page_object = page_object;
  this.tableschema_name = undefined;
  this.table_id = undefined;
  this.$table = undefined;
  
  this.items = new Array();
   
  this.item_count = 0;
  
  this.model_record = new Array();
  this.$model_row = null;
  this.model_regexp = null;
  this.should_use_autoguid = false;
  
  this.list_order_where = "";

} // end constructor


// -------------------------------------------------------------------------------
// one-time initialize

dtack_page_tied_records_c.prototype.initialize = function(tableschema_name, table_id, model_record, options)
{
  var F = "initialize";
  
  var that = this;
                                             
  this.list_order_where = this.option_value(options, "list_order_where", "");

  this.debug_verbose(F, "initializing " + tableschema_name + 
    " tied records on table #" + table_id + 
    " and model record " + this.option_keys_text(model_record) +
    " with list_order_where " + this.vts(this.list_order_where));

  this.tableschema_name = tableschema_name;
  this.table_id = table_id;
  this.model_record = model_record;
  
  this.$table = $("#" + this.table_id);
  
  var $tbody = $("#" + this.table_id + " TBODY");
  
  var $rows = $("#" + this.table_id + " > TBODY > TR");
  
  this.item_count = $rows.length;
  
  this.debug_verbose(F, "the table #" + this.table_id + " has " + $rows.length + " rows");
  this.assert("the table #" + this.table_id + " has " + $rows.length + " rows", $rows.length > 0);
  
  this.discover_model_row(options);
  
                                         // the page is set up for issuing ajax?    
  if (this.page_object.ajax_issuer !== undefined)
  {
                                        // remove rows using ajax
                                        // only put the remove-row event on the model row
                                        // watchfrog #232
    //$(".remove_row", this.$model_row).click(
                                        // actually, add the remove event handle to all rows in the tied records table during initialization (not just the model)
                                        // watchfrog #237
    $(".remove_row", $rows).click(
      function(event)
      {
        that.page_object.handle_click_delete_row_autoid(event);
	  }
	);

  }
                                         // the page not is set up for issuing ajax?    
  else
  {
    $("A.remove_tied_record", this.$table).click(
      function(jqeo)
      {
        that.debug("remove_tied_record", "removing " + $(this).attr("id"));
        jqeo.preventDefault();
                                          // eztask #12856: remove-add-another address is not working in IE11 
        $row = $(this).closest("TR");
        $row.remove();
        that.page_object.add_to_posted_change_list2($(this).attr("id"), that.page_object.POSTED_CHANGE_ACTION_CHANGED);
	  }
    );
  }

} // end method

// -------------------------------------------------------------------------------
// create a new tied record and display it
// add to DOM by cloning the model row for immediate display
// if there is an ajax issuer instance, then use ajax to do the add

dtack_page_tied_records_c.prototype.create = function(options)
{
  var F = "create";
                                         // the page is set up for issuing ajax?    
  if (this.page_object.ajax_issuer !== undefined)
  {
  	this.debug(F, "creating tied record using ajax.issuer");
    return this.create_ajax_xml(this.model_record, options);
  }
                                         // the page not is set up for issuing ajax?    
  else
  {
  	this.debug(F, "creating tied record locally because no page_object.ajax_issuer");
    return this.create_local(this.model_record, options);
  }
  
}  // end method
 
 
// -------------------------------------------------------------------------------
// create a new tied record and display it
// add to DOM by cloning the model row for immediate display
// issue ajax to do the insert
// when ajax is done, assign the autoid to the input fields

dtack_page_tied_records_c.prototype.create_ajax_xml = function(model_record, options)
{
  var F = "create_ajax_xml";
                                          // nag if feature not enabled
  dtack_javascript_utility_feature_check("dtack_javascript tied_records ajax");

                                         // add to DOM by cloning the model row for immediate display
  var $new_row = this.create_new_row_in_dom(this.$table, options);
    
  var xml = "<tableschema_name>" + this.tableschema_name + "</tableschema_name>";
  
                                        // allow caller to specify list_order_where when adding another
                                        // watchfrog #227
  xml += "<list_order_where>" + this.list_order_where + "</list_order_where>";
  xml += "<fieldschema_name_value_pairs>";
  
  
  if (!options)
  {
  	this.debug(F, "no initial fields because options not specified");
  }
  else
  if (options.initial_fields)
  {
    this.debug(F, "initial fields " + this.option_keys_text(options.initial_fields));
    
    for (var fieldschema_name in options.initial_fields)
    {
  	  if (fieldschema_name == "")
  	    continue;
  	    
  	  xml += 
  	    "<" + fieldschema_name + ">" +
  	    this.dtack_environment.escape_xml(options.initial_fields[fieldschema_name]) +
  	    "</" + fieldschema_name + ">";
    }
  }
  else
  {
  	this.debug(F, "no initial fields because options.initial_fields not specified");
  }
  
  this.debug(F, "creating " + this.tableschema_name + 
    " tied for model record " + this.option_keys_text(model_record) +
    " with list_order_where " + this.vts(this.list_order_where));
  
  for (var fieldschema_name in model_record)
  {
  	if (fieldschema_name == "")
  	  continue;
  	  
  	xml += 
  	  "<" + fieldschema_name + ">" +
  	  this.dtack_environment.escape_xml(model_record[fieldschema_name]) +
  	  "</" + fieldschema_name + ">";
  }
  
  xml += "</fieldschema_name_value_pairs>";
  
  //var position = this.option_value(options, "position", "0");
  //xml += "<position>" + position + "</position>";
                                     
                                    
  var tied_record = new dtack_page_tied_record_c(this, $new_row);
  
  
                                        // add model record field values to tied record when inserted
                                        // after insertion, a spreadsheet might which to condition the new row based on model values
                                        // watchfrog #231
  tied_record.model_record_copy = {};
  for(var k in model_record)
  {
  	if (k != "autoid" &&
  	    k != "autoguid")
    {
      //this.debug(F, "model_row[" + k + "] is " + this.vts(tied_record.model_record[k]));
  	  tied_record.model_record_copy[k] = model_record[k];
	}
  }
  
  
                                        // clear input values in the row
  tied_record.clear_inputs();
  
                                        // also pull a trigger on the parent to let it know the input fields are ready
                                        // watchfrog #207
  this.pull_triggers("cloned_record", tied_record);

                                        // specify the handler to be called when the request finishes
  tied_record.attach_trigger(
    "inserted_record", 
    "handle_create_ajax_xml_finished");


  this.page_object.ajax_issuer.issue_command(
    "insert_record", 
    xml,
                                        // trigger_string
    "inserted_record", 
                                        //trigger_object
    tied_record, 
    options);
                                        // DON'T assign all input elements in the new row with autoid
                                        // when ajax is done, the trigger will do it
  //this.assign_new_row_autoid($new_row, "-" + that.item_count);
  
                                        // return the new row to the caller for populating if desired
  return $new_row;
  
}  // end method
                                                 

 
// -------------------------------------------------------------------------------
// create a new tied record and display it
// add to DOM by cloning the model row for immediate display

dtack_page_tied_records_c.prototype.create_local = function(model_record, options)
{
  var F = "create_local";
                                         // add to DOM by cloning the model row for immediate display
  $new_row = this.create_new_row_in_dom(model_record, options);
                                                                            
  var tied_record = new dtack_page_tied_record_c(this, $new_row);

                                        // clear input values in the row
  tied_record.clear_inputs();
  
  if (model_record["autoid"])
  {
                                        // immediately assign all input elements in the new row with real autoid
    tied_record.assign_autoid(model_record["autoid"]);
  }
  else
  {
                                        // immediately assign all input elements in the new row with fake autoid
    tied_record.assign_autoid("-" + this.item_count);
  }
                                                   
                                        // display visible fields in the model record after row creation
                                        // watchfrog #219             
  for(var k in model_record)
  {
  	$("[data-tied_record_value_container=\"" + k + "\"]", $new_row).html(model_record[k]);
  }
                                        // return the new row to the caller for populating if desired
  return $new_row;
                             
}  // end method
 
 
// -------------------------------------------------------------------------------
// add to DOM by cloning the model row for immediate display

dtack_page_tied_records_c.prototype.discover_model_row = function(options)
{
  var F = "discover_model_row";
  
                                        // model row not created yet?
                                        // we cannot clone the model row until the event handlers have been added
                                        // this should have been done by the time the create button is clicked  
  if (this.$model_row)
    return;
  
  var $rows = $("#" + this.table_id + " > TBODY > TR");
  
                                        // get the model row
    this.$model_row = $rows.parent().children("[data-is_tied_records_model_row=\"yes\"]");
    
    if (this.$model_row.length > 0)
    {
                                        // model row mechanism circa 2015-09-13: the model row will have a data tag identifying it
                                        // watchfrog #221
      this.$model_row = this.$model_row.first();
      this.debug_verbose(F, "model row is #" + this.$model_row.attr("id"));
      this.debug_verbose(F, "model row from is_tied_records_model_row is #" + this.$model_row.attr("id"));
      
      this.$model_row.hide();
                                        // the add-another button will insert a new row into the dom after the model row
      this.$existing_row = this.$model_row;
      
      this.should_add_new_row_after_existing_row = false;
	}
	else
	{
                                        // this is the second row since the TH is the first row
                                        // we presume that the php has rendered at least one row
      this.$model_row = $rows.first().next().clone(true, true);
      this.debug_verbose(F, "model row from second row is #" + this.$model_row.attr("id"));
                                        // presume there is at least one row (namely the row with the TH's in it)
      this.$existing_row = $rows.first();
                                        // check for hidden row, which, if exists, will stay at the top for further model clones
                                        // watchfrog #212
      if (this.$existing_row.css("display") == "none")
        this.$existing_row = this.$existing_row.next();

      this.should_add_new_row_after_existing_row = true;
	}

}  // end method
 
 
// -------------------------------------------------------------------------------
// add to DOM by cloning the model row for immediate display

dtack_page_tied_records_c.prototype.create_new_row_in_dom = function($table, options)
{
  var F = "create_new_row_in_dom";
  
  var $rows = $("#" + this.table_id + " > TBODY > TR");
  
  this.discover_model_row(options);

  this.debug_verbose(F, "adding " + this.tableschema_name + " tied record #" + this.item_count + " on table " + this.$table.attr("id"));
  
  this.item_count++;
  
  
  //this.debug(F, "$existing row id \"" + $existing_row.attr("id") + "\" display is \"" + $existing_row.css("display") + "\"");
  
  
  var $new_row = this.$model_row.clone(true, true);
  
  if (this.should_add_new_row_after_existing_row)
    this.$existing_row.after($new_row);
  else
    this.$existing_row.before($new_row);
  
  $new_row.attr("data-is_tied_records_model_row", "no");
  
  $new_row.show();
                                        // return the new row to the caller for populating if desired
  return $new_row;
  
}  // end method
 
// -------------------------------------------------------------------------------
// this was an attempt to support autoguids, failed for some reason and development paused

dtack_page_tied_records_c.prototype.make_model_regexp = function($inputs)
{
  var F = "make_model_regexp";
                                        // first time we have created a row?
  if (this.model_regexp === null)
  {
    var $first_input = $inputs.first();
    this.model_name = $first_input.attr("name");
    var position = this.model_name.indexOf("[");
    var pattern = this.model_name.substring(0, position) + "\\[([^\\]]+)\\]";
    this.debug(F, "model name is \"" + this.model_name + "\", position is " + position + " pattern is \"" + pattern + "\"");
    this.model_regexp = new RegExp(pattern);
    var matches = this.model_name.match(this.model_regexp);
    this.debug(F, "----------------");
    if (matches === null)
      this.debug(F, "no match");
    else
    {
      var match = matches[1];
                                        // the autoid part is all-numeric?
      if (match.match(/^[0-9]+$/))
      {
      	                                // don't use autoguids in names on new rows
        this.should_use_autoguid = false;
	  }
                                        // the autoid part of the model suggests it is using autoguid?
      else
      {
      	                                // use autoguids in names on new rows
        this.should_use_autoguid = true;
	  }
//      for(var k in matches)
//        that.debug(F, "matches[" + k + "]: " + matches[k]);
	}
  }
  
                                        // we are using autoguids as identifiers?
  if (this.should_use_autoguid)
    this.new_autoid_part = this.model_name.substring(0, position) + "[" + this.generate_guid() + "]";
  else
    this.new_autoid_part = this.model_name.substring(0, position) + "[" + (-this.item_count) + "]";
  
} // end method
 
// -------------------------------------------------------------------------------
dtack_page_tied_records_c.prototype.S4 = function()
{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// -------------------------------------------------------------------------------
dtack_page_tied_records_c.prototype.generate_guid = function()
{
  return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
                             
}  // end method
 
 
// -------------------------------------------------------------------------------
// return the DOM rows collection

dtack_page_tied_records_c.prototype.peek_rows = function()
{
  var $rows = $("#" + this.table_id + " > TBODY > TR");
  
  return $rows;
  
} // end method





// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack_page_tied_record_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_page_tied_record_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_page_tied_record_c.prototype.constructor = dtack_page_tied_record_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_page_tied_record_c(tied_records, $row, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_page_tied_record_c";

										/* call the base class constructor helper */
	dtack_page_tied_record_c.prototype.base.constructor.call(
	  this,
	  tied_records.dtack_environment,
	  classname != undefined? classname: F);
  }

  this.tied_records = tied_records;
  this.page_object = tied_records.page_object;
  this.$row = $row;
  this.autoid = undefined;

} // end constructor

// ----------------------------------------------------------------------------
// called with an ajax object that has finished its request
// ajax_object.trigger_object.pull_triggers(ajax_object.trigger_string, response)

dtack_page_tied_record_c.prototype.handle_create_ajax_xml_finished = function($response)
{
  var F = "dtack_page_tied_record_c::handle_create_ajax_xml_finished";

  this.debug_verbose(F, "create ajax xml finished for " + this.vts(this.tied_records.tableschema_name) + " tied record");
  
  this.assert("response_object is undefined", $response !== undefined);

  $autoid = $response.find("autoid");
    
  this.assert("response_object.autoid not found", $autoid.length > 0);
  
  this.autoid = $autoid.text();
  
                                        // assign all input elements and some output elements in the row with autoid
  this.assign_autoid(this.autoid);
                                                  
                                        // initialize ajax for input fields in the new row          
                                        // (presumably if the table is using ajax inserts, it is using ajax updates too)
                                        // eztask #13369: unsaved changes warning comes up after doing an add-another on the spreadsheet
                                        // watchfrog #228
  this.page_object.initialize_ajax(this.$row);

                                        // also pull a trigger on the parent to let it know the autoids are assigned
  this.tied_records.pull_triggers("inserted_record", this);
  
} // end method

// -------------------------------------------------------------------------------
// assign all input elements and some output elements in the row with autoid

dtack_page_tied_record_c.prototype.assign_autoid = function(autoid)
{
  var F = "assign_autoid";
  
  var $inputs = $("INPUT:TEXT", this.$row);
  $inputs = $inputs.add($("TEXTAREA", this.$row));
  $inputs = $inputs.add($("INPUT:CHECKBOX", this.$row));
  $inputs = $inputs.add($("SELECT", this.$row));
  $inputs = $inputs.add($("INPUT:FILE", this.$row));


  var old_id = this.$row.attr("id");
  //this.assert("this.$row.attr(\"id\") is " + this.vts(old_id), old_id);
  
  var new_id = old_id.replace(/\[[0-9]+\]/g, "[" + autoid + "]");
  this.$row.attr("id", new_id);
  this.debug_verbose(F, "changed row id from \"" + old_id + "\" to \"" + new_id + "\"");

  this.debug_verbose(F, "row has " + $inputs.length + " inputs now being assigned autoid " + autoid);
  
  var that = this;
                                        // change the form field names on all the new inputs
  $inputs.each(
    function(index, element)
    {
      var old_name = element.name;
      var new_name = old_name.replace(/\[[0-9]+\]/g, "[" + autoid + "]");
      element.name = new_name;
      that.debug_verbose("each_input", "changed " + element.tagName + " name from \"" + old_name + "\" to \"" + new_name + "\"");
      
                                        // input fields can have id's like table_autoid_field to support ajax updates
                                        // watchfrog #220
      var old_id = element.id;
      var new_id = old_id.replace(/\[[0-9]+\]/g, "[" + autoid + "]");
      new_id = new_id.replace(/\_[0-9]+\_/g, "_" + autoid + "_");
      element.id = new_id;
      that.debug_verbose("each_input", "changed " + element.tagName + " id from \"" + old_id + "\" to \"" + new_id + "\"");
	}
  );
                                        // also change the html id of the icon which removes an item
  $divs = $("DIV.remove_row", this.$row);
                                        // change the form field names on all the new inputs
  $divs.each(
    function(index, element)
    {
      var old_id = element.id;

      var new_id = old_id.replace(/\[[0-9]+\]/g, "[" + autoid + "]");

      element.id = new_id;
      that.debug_verbose("each_div", "changed " + element.tagName + " id from \"" + old_id + "\" to \"" + new_id + "\"");
	}
  );
  
                                        // let the page object activate (reactivate) any fileupload controls in the new row
                                        // watchfrog #224
  this.page_object.activate_fileuploads(
    {
       $container: this.$row
	}
  );
  
}  // end method
 
// -------------------------------------------------------------------------------
// clear all input elements in the row 

dtack_page_tied_record_c.prototype.clear_inputs = function()
{
  var F = "clear_inputs";
  
  var $inputs = $("INPUT:TEXT", this.$row);
  $inputs = $inputs.add($("TEXTAREA", this.$row));
  $inputs = $inputs.add($("SELECT", this.$row));

  //this.debug(F, "row has " + $inputs.length + " inputs now being cleared");
  
  var that = this;
                                        // change the form field names on all the new inputs
  $inputs.each(
    function(index, element)
    {
      //that.debug("each_input", "cleared " + element.tagName + " \"" + element.name);
      
      if (element.tagName == "SELECT")
      {
      	element.selectedIndex = -1;
        element.value = "";
	  }
	  else
	  {
        element.value = "";
	  }
	}
  );
  
}  // end method
 
