// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
harnesses__interaction_01__level2_interaction_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
harnesses__interaction_01__level2_interaction_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
harnesses__interaction_01__level2_interaction_c.prototype.constructor = harnesses__interaction_01__level2_interaction_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function harnesses__interaction_01__level2_interaction_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "harnesses__interaction_01__level2_interaction_c";

										/* call the base class constructor helper */
	harnesses__interaction_01__level2_interaction_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED = "harnesses__interaction_01__level2_interaction_c::SELECTED_ITEM_CHANGED";
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


harnesses__interaction_01__level2_interaction_c.prototype.activate = function(
  page, 
  input_selector)
{
  var F = "activate";
  
  this.page = page;
  this.input_selector = input_selector;
  this.user_preference_variable = this.input_selector.replace("#", "_") + "_autoid";
  
  var that = this;
                                    
  this.$input_selector = $(input_selector);
  
  this.assert("no  pulldown on this page for selector " + this.vts(input_selector), this.$input_selector.length > 0);
  this.assert("too many pulldowns on this page for selector " + this.vts(input_selector), this.$input_selector.length == 1);
  
  this.pulldown = this.$input_selector.get(0);

  this.assert("unable to get DOM element for selector " + this.vts(input_selector), this.pulldown);
                                                     
                                        // handle event where the pulldown value changes
  this.$input_selector.change(
    function(jquery_event_oject)
    {
      var json_object = that.search_for_json_object_with_autoid($(this).val());
      that.poke_current_json_object(json_object);
      that.pull_triggers(that.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED, {});
	}
  );
                                        // make a data entry field to validate the associated form input field
  //this.data_entry_field = new dtack__data_entry__select_c(this.dtack_environment, input_selector);
  //this.page.activate_data_entry_field(this.data_entry_field);

} // end method

// -------------------------------------------------------------------------------


harnesses__interaction_01__level2_interaction_c.prototype.cascade = function(
  json_objects)
{
  var F = "cascade";
  
  this.json_objects = json_objects;
  
  var json_autoids = "";
  if (json_objects)
  for(var k in json_objects)
  	json_autoids += (json_autoids == ""? "": ", ") + k;
  	
  this.debug_verbose(F, "cascading json " + this.user_preference_variable + " selection to use autoids {" + json_autoids + "}");
                      
  this.pulldown.options.length = 0;

  this.pulldown.options[this.pulldown.options.length] = new Option( 
    "please select",
    "",
    true,
    true);

  this.pulldown.options.selectedIndex = 0;
  var user_preference_autoid = this.page.host_value("user_preferences.values." + this.user_preference_variable, "");
  
  this.debug_verbose(F, "user_preference_autoid is " + this.vts(user_preference_autoid));
                    
  this.current_json_object = this.search_for_json_object_with_autoid(user_preference_autoid);
  
  if (json_objects)
  for(var k in this.json_objects)
  {
  	var json_object = this.json_objects[k];
  	
    this.pulldown.options[this.pulldown.options.length] = new Option( 
      json_object.name,
      json_object.autoid,
      false,
      false);
  	
  	if (json_object.autoid == user_preference_autoid)
  	{
      this.pulldown.options.selectedIndex = this.pulldown.options.length - 1;
	}
  }  

} // end method
                                              
// -------------------------------------------------------------------------------

harnesses__interaction_01__level2_interaction_c.prototype.poke_current_json_object = function(current_json_object)
{
  var F = "poke_current_json_object";

                                        // remember the selected value internally
  this.current_json_object = current_json_object;

  this.debug_verbose(F, "poking current tollpoint object " + this.vts(this.current_json_object? this.current_json_object.autoid: "") + " for " + this.user_preference_variable);
    
  var autoid = "0";
  if (this.current_json_object)
    autoid = this.current_json_object.autoid
  
  this.page.host_set("user_preferences.values." + this.user_preference_variable, autoid);
      
                                        // use ajax to update the persistent user preference
  this.page.update_user_preference(this.user_preference_variable, autoid);
      
  this.update_display();

  	                                   // remove pink stuff if there is any
  //this.data_entry_field.poke_is_valid(true);
          
} // end function
                                                                                                        
// -------------------------------------------------------------------------------
// apply current styles to map primitives

harnesses__interaction_01__level2_interaction_c.prototype.update_display = function()
{
  var F = "update_display";

  this.pulldown.selectedIndex = 0;
  for(var index=1; index<this.pulldown.options.length; index++)
  {
  	var json_autoid = this.pulldown.options[index].value;   
  	
  	var pulldown_json_object = this.search_for_json_object_with_autoid(json_autoid);
  	if (this.current_json_object &&
  	    pulldown_json_object &&
  	    pulldown_json_object.autoguid == this.current_json_object.autoguid)
  	{
  	  this.pulldown.selectedIndex = index;
  	  break;
	}
  }
          
} // end function

// -------------------------------------------------------------------------------
// apply current styles to map primitives

harnesses__interaction_01__level2_interaction_c.prototype.search_for_json_object_with_autoid = function(json_autoid)
{
  var F = "search_for_json_object_with_autoid";
  for(var k in this.json_objects)
  {
  	if (this.json_objects[k].autoid == json_autoid)
  	  return this.json_objects[k];
  }
  
  return null;
          
} // end function
                     
// -------------------------------------------------------------------------------

harnesses__interaction_01__level2_interaction_c.prototype.start_over = function()
{
  var F = "start_over";
  
  this.poke_current_json_object(null);

} // end function