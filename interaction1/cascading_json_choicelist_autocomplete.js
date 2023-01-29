// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_autocomplete_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_autocomplete_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_autocomplete_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED = "dtack__interaction__cascading_json_choicelist_autocomplete_c::SELECTED_ITEM_CHANGED";
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.activate = function(
  page, 
  input_selector)
{
  var F = "activate";
  
  this.page = page;
  this.input_selector = input_selector;
  
  var that = this;
                                    
  this.$input_selector = $(input_selector);
  
  this.assert("nothing found on this page for selector " + this.vts(input_selector), this.$input_selector.length > 0);
  this.assert("too many things found on this page for selector " + this.vts(input_selector), this.$input_selector.length == 1);

                                        // handle event where the autocomplete value changes
  this.$input_selector.on("autocompletechange",
    function(jquery_event_oject, ui)
    {
      if (ui && ui.item)
      {
        that.debug_verbose(F, "input value has changed to " + that.vts(ui.item.stored));

                                        // let this be known as our current value
        that.poke_current_json_stored(ui.item.stored);
	  }
	  else
	  {
        that.poke_current_json_object(null);
	  }
	  
      
                                        // let all listeners know that there is a new value on this object
      that.pull_triggers(that.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED, {});
	}
  );

} // end method

// -------------------------------------------------------------------------------
// set up the autocomplete options to reflect the given set of json objects

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.cascade = function(
  json_objects)
{
  var F = "cascade";
                                        // remember the given set of json objects
  this.json_objects = json_objects;
  
  var json_storeds = "";
  if (this.json_objects)
  for(var k in this.json_objects)
  	json_storeds += (json_storeds == ""? "": ", ") + this.json_objects[k].stored;
  	
  this.debug_verbose(F, "cascading autocomplete to use storeds {" + json_storeds + "}");
  
  var source_array = new Array();
  this.$input_selector.val("");
  
  if (json_objects)
  for(var k in this.json_objects)
  {
  	var json_object = this.json_objects[k];
  	
  	source_array.push({stored: json_object.stored, value: json_object.showed});
  	
  	if (this.current_json_object && this.current_json_object.stored == json_object.stored)
  	{
      this.$input_selector.val(json_object.showed);
	}
  }
                       
  this.$input_selector.autocomplete("option", "source", source_array);

} // end method
                                              
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.poke_current_json_stored = function(json_stored)
{
  var F = "poke_current_json_stored";
  
  var json_object = this.search_for_json_object_with_stored(json_stored);
  
  if (json_object == null)
  {
  	this.debug_verbose(F, "unable to find json object with stored " + this.vts(json_stored));
    this.poke_current_json_object(null);
  }
  else
  {
    this.poke_current_json_object(json_object);
  }
          
} // end function
                                              
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.poke_current_json_object = function(current_json_object)
{
  var F = "poke_current_json_object";

                                        // remember the data object internally
  this.current_json_object = current_json_object;

  this.debug_verbose(F, "poking current json object " + this.vts(this.current_json_object? this.current_json_object.stored: "null"));
      
  this.update_display();
          
} // end function
                                                                                                        
// -------------------------------------------------------------------------------
// update the display to show the value of the current json object

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.update_display = function()
{
  var F = "update_display";
  if (this.current_json_object)
  {
    this.$input_selector.val(this.current_json_object.showed);
  }
  else
  {
    this.$input_selector.val("");
  }
          
} // end function

// -------------------------------------------------------------------------------
// apply current styles to map primitives

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.search_for_json_object_with_stored = function(json_stored)
{
  var F = "search_for_json_object_with_stored";
  for(var k in this.json_objects)
  {
  	if (this.json_objects[k].stored == json_stored)
  	  return this.json_objects[k];
  }
  
  return null;
          
} // end function
                     
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_autocomplete_c.prototype.start_over = function()
{
  var F = "start_over";
  
  this.poke_current_json_object(null);

} // end function