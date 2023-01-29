// --------------------------------------------------------------------
// class representing the page being viewed in the browser
// copied this class from dtack_javascript permix_global release 1.1
// eztask #15567 restore legacy non-ajax tied record functionality into base libraries for fd100 to continue to use it

										// inherit the base methods and variables
dtack_page_tied_records_non_ajax_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_page_tied_records_non_ajax_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_page_tied_records_non_ajax_c.prototype.constructor = dtack_page_tied_records_non_ajax_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_page_tied_records_non_ajax_c(page_object, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_page_tied_records_non_ajax_c";

										/* call the base class constructor helper */
	dtack_page_tied_records_non_ajax_c.prototype.base.constructor.call(
	  this,
	  page_object.dtack_environment,
	  classname != undefined? classname: F);
  }

  this.page_object = page_object;
  this.tableschema_name = undefined;
  this.table_id = undefined;
  this.$table = undefined;
  
  this.items = new Array();
   
  this.item_count = 0;
  
  this.model_regexp = null;
  this.should_use_autoguid = false;

} // end constructor


// -------------------------------------------------------------------------------
// one-time initialize

dtack_page_tied_records_non_ajax_c.prototype.initialize = function(tableschema_name, table_id, options)
{
  var F = "initialize";
  
  var that = this;
  
  this.debug(F, "initializing " + tableschema_name + " tied records on table #" + table_id);

  this.tableschema_name = tableschema_name;
  this.table_id = table_id;
  
  this.$table = $("#" + this.table_id);
  
  var $tbody = $("#" + this.table_id + " TBODY");
  
  var $rows = $("#" + this.table_id + " TBODY TR");
  
  this.item_count = $rows.length;
  
  this.debug(F, "the table has " + $rows.length + " rows");
                                                      
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
                                        // get the model row
                                        // this is the second row since the TH is the first row
                                        // we presume that the php has rendered at least one row
  this.$model_row = $rows.first().next().clone(true);
  var $last_row = $rows.last();

  this.debug(F, "model row is #" + this.$model_row.attr("id"));
  this.debug(F, "last row is #" + $last_row.attr("id"));

} // end method

// -------------------------------------------------------------------------------
// create a new tied record and display it
// add to DOM by cloning the model row for immediate display

dtack_page_tied_records_non_ajax_c.prototype.create = function($table, options)
{
  var F = "create";
  
  var that = this;

  this.debug(F, "adding " + this.tableschema_name + " tied record #" + this.item_count + " on table " + this.$table.attr("id"));
  
  this.item_count++;
  
  var $rows = $("#" + this.table_id + " TBODY TR");
  
                                        // presume there is at least one row (namely the row with the TH's in it)
  var $last_row = $rows.last();
  
  var $new_row = this.$model_row.clone(true);
  $last_row.after($new_row);
  
  var $inputs = $("INPUT:TEXT", $new_row);
  $inputs = $inputs.add($("TEXTAREA", $new_row));
  $inputs = $inputs.add($("SELECT", $new_row));

  this.debug(F, "new row has " + $inputs.length + " inputs");
  
                                        // make the model regex for changing field names 
                                        // this was an attempt to support autoguids, failed for some reason and development paused
  //this.make_model_regexp($inputs);

                                        // change the form field names on all the new inputs
  $inputs.each(
    function(index, element)
    {
      var old_name = element.name;

      //var new_name = old_name.replace(that.model_regexp, that.new_autoid_part);
      var new_name = old_name.replace(/\[[0-9]+\]/g, "[-" + that.item_count + "]");

      element.name = new_name;
      
      if (element.tagName == "SELECT")
      {
      	element.selectedIndex = -1;
        element.value = "";
	  }
	  else
	  {
        element.value = "";
	  }
      that.debug("each_input", "changed " + that.item_count + " " + element.tagName + " \"" + old_name + "\" to \"" + new_name + "\"");
	}
  );
                                        // return the new row to the caller for populating if desired
  return $new_row;
  
}  // end method
 
// -------------------------------------------------------------------------------
// this was an attempt to support autoguids, failed for some reason and development paused

dtack_page_tied_records_non_ajax_c.prototype.make_model_regexp = function($inputs)
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
dtack_page_tied_records_non_ajax_c.prototype.S4 = function()
{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// -------------------------------------------------------------------------------
dtack_page_tied_records_non_ajax_c.prototype.generate_guid = function()
{
  return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
}