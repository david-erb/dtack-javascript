// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_base_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_base_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_base_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_base_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_base_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_base_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_base_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	
	this.data_entry_object = null;

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED = "dtack__interaction__cascading_json_choicelist_base_c::SELECTED_ITEM_CHANGED";
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__interaction__cascading_json_choicelist_base_c.prototype.activate = function(
  page, 
  input_selector)
{
  var F = "activate";
  
  this.page = page;
  this.input_selector = input_selector;
  this.debug_verbose(F, "activating " + this.vts(this.input_selector));
  
  this.$input_selector = $(input_selector);
  
  this.assert("nothing found on this page for selector " + this.vts(input_selector), this.$input_selector.length > 0);
  this.assert("too many things found on this page for selector " + this.vts(input_selector), this.$input_selector.length == 1);

} // end method
                                                                                                                                  
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_base_c.prototype.poke_data_entry_object = function(data_entry_object)
{
  var F = "poke_data_entry_object";
  
  this.data_entry_object = data_entry_object;
          
} // end function
                                    
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_base_c.prototype.poke_current_json_stored = function(json_stored)
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
  
  this.update_display();
          
} // end function
                                              
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_base_c.prototype.poke_current_json_object = function(current_json_object)
{
  var F = "poke_current_json_object";

                                        // remember the pulldowned object internally
  this.current_json_object = current_json_object;

  this.debug_verbose(F, "poking current json object " + this.vts(this.current_json_object? this.current_json_object.stored: "null"));
      
  this.update_display();
          
} // end function

// -------------------------------------------------------------------------------
// apply current styles to map primitives

dtack__interaction__cascading_json_choicelist_base_c.prototype.search_for_json_object_with_stored = function(json_stored)
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

dtack__interaction__cascading_json_choicelist_base_c.prototype.start_over = function()
{
  var F = "start_over";
  
  this.poke_current_json_object(null);

} // end function