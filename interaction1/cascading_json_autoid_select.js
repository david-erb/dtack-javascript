// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__interaction__cascading_json_autoid_select_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_autoid_select_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_autoid_select_c.prototype.constructor = dtack__interaction__cascading_json_autoid_select_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_autoid_select_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_autoid_select_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_autoid_select_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED = "dtack__interaction__cascading_json_autoid_select_c::SELECTED_ITEM_CHANGED";
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__interaction__cascading_json_autoid_select_c.prototype.activate = function(
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
  
  this.pulldown = this.$input_selector.get(0);

  this.assert("unable to get DOM element for selector " + this.vts(input_selector), this.pulldown);
                                                     
                                        // handle event where the pulldown value changes
  this.$input_selector.change(
    function(jquery_event_oject)
    {
                                        // find the json object which matches the pulldown current value
      var json_object = that.search_for_json_object_with_autoid($(this).val());
      
                                        // let this be known as our current value
      that.poke_current_json_object(json_object);
      
                                        // let all listeners know that there is a new value on this object
      that.pull_triggers(that.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED, {});
	}
  );

} // end method

// -------------------------------------------------------------------------------
// set up the pulldown options to reflect the given set of json objects

dtack__interaction__cascading_json_autoid_select_c.prototype.cascade = function(
  json_objects)
{
  var F = "cascade";
                                        // remember the given set of json objects
  this.json_objects = json_objects;
  
  var json_autoids = "";
  if (this.json_objects)
  for(var k in this.json_objects)
  	json_autoids += (json_autoids == ""? "": ", ") + this.json_objects[k].autoid;
  	
  this.debug_verbose(F, "cascading selection to use autoids {" + json_autoids + "}");
                      
  this.pulldown.options.length = 0;

  this.pulldown.options[this.pulldown.options.length] = new Option( 
    "please select",
    "",
    true,
    true);
  
  if (json_objects)
  for(var k in this.json_objects)
  {
  	var json_object = this.json_objects[k];
  	
    this.pulldown.options[this.pulldown.options.length] = new Option( 
      json_object.name,
      json_object.autoid,
      false,
      false);
  	
  	if (this.current_json_object && this.current_json_object.autoid == json_object.autoid)
  	{
      this.pulldown.options.selectedIndex = this.pulldown.options.length - 1;
	}
  }
  
} // end method
                                              
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_autoid_select_c.prototype.poke_current_json_object = function(current_json_object)
{
  var F = "poke_current_json_object";

                                        // remember the selected object internally
  this.current_json_object = current_json_object;

  this.debug_verbose(F, "poking current json object " + this.vts(this.current_json_object? this.current_json_object.autoid: ""));
    
  var autoid = "0";
  if (this.current_json_object)
    autoid = this.current_json_object.autoid
      
  this.update_display();
          
} // end function
                                                                                                        
// -------------------------------------------------------------------------------
// update the display to show the value of the current json object

dtack__interaction__cascading_json_autoid_select_c.prototype.update_display = function()
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

dtack__interaction__cascading_json_autoid_select_c.prototype.search_for_json_object_with_autoid = function(json_autoid)
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

dtack__interaction__cascading_json_autoid_select_c.prototype.start_over = function()
{
  var F = "start_over";
  
  this.poke_current_json_object(null);

} // end function