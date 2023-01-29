// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_pulldown_c.prototype = new dtack__interaction__cascading_json_choicelist_base_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.base = dtack__interaction__cascading_json_choicelist_base_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_pulldown_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_pulldown_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_pulldown_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.activate = function(
  page, 
  input_selector)
{
  var F = "activate";
  
										/* call the base class constructor helper */
  dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.base.activate.call(
	this,
	page,
	input_selector);

  var that = this;
  
  this.pulldown = this.$input_selector.get(0);

  this.assert("unable to get DOM element for selector " + this.vts(input_selector), this.pulldown);
                                                     
  //this.instance_debug_level = 1;
  
                                        // handle event where the pulldown value changes
  this.$input_selector.change(
    function(jquery_event_object)
    {
                                        // find the json object which matches the pulldown current value
      var json_object = that.search_for_json_object_with_stored($(this).val());
      
                                        // let this be known as our current value
      that.poke_current_json_object(json_object);
      
      that.debug("change", "jquery_event_object is " + that.vts(jquery_event_object));
       //
                                        // let all listeners know that there is a new value on this object
      that.pull_triggers(that.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED, {jquery_event_object: jquery_event_object});
	}
  );

} // end method
                                                 
// -------------------------------------------------------------------------------
// set up the pulldown options to reflect the given set of json objects

dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.poke_json_objects = function(
  json_objects,
  options)
{
  var F = "poke_json_objects";
                                        // remember the given set of json objects
  this.json_objects = json_objects;
                      
  this.pulldown.options.length = 0;

  if (json_objects)
  {
    var json_storeds = "";
    for(var k in this.json_objects)
  	  json_storeds += (json_storeds == ""? "": ", ") + this.json_objects[k].stored;
  	
    this.debug_verbose(F, "cascading pulldown to use storeds {" + json_storeds + "}");

    this.pulldown.options[this.pulldown.options.length] = new Option( 
      "please select",
      "",
      true,
      true);
      
    this.pulldown.selectedIndex = 0;
    
    for(var k in this.json_objects)
    {
  	  var option_json_object = this.json_objects[k];
  	  
      this.pulldown.options[this.pulldown.options.length] = new Option( 
        option_json_object.showed,
        option_json_object.stored,
        false,
        false);
  	  
  	  if (this.current_json_object && this.current_json_object.stored == option_json_object.stored)
  	  {
        this.pulldown.selectedIndex = this.pulldown.options.length - 1;
        this.debug_verbose(F, "no option index " + this.pulldown.selectedIndex + " matches current stored" + this.vts(this.current_json_object.stored));
	  }
    }
    
    if (this.current_json_object && this.pulldown.selectedIndex == 0)
    {
      this.debug_verbose(F, "no option matches current stored" + this.vts(this.current_json_object.stored));
      this.current_json_object = null;
	}
  }
  else
  {

    this.pulldown.options[this.pulldown.options.length] = new Option( 
      "please select",
      "",
      true,
      true);
      
    this.pulldown.selectedIndex = 0;

    this.debug_verbose(F, "cascading pulldown null");
    this.current_json_object = null;
  }
  
	                                    // user instigated this change of json objects?
  if (this.is_affirmative_option(options, "is_operator_instigated"))
  {
  	                                   // mark the field as changed so the value gets posted with the form
     this.page.add_to_posted_change_list(this.pulldown);
    
                                        // also clear any indication that this field is invalid 
     if (this.data_entry_object)
       this.data_entry_object.poke_is_valid(true);
  }
  
} // end method
                                                                          
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.poke_current_json_object = function(current_json_object, options)
{
  var F = "poke_current_json_object";
                                                      										/* call the base class constructor helper */
  dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.base.poke_current_json_object.call(
	this,
	current_json_object);
	
  if (this.is_affirmative_option(options, "is_operator_instigated"))
  {
    this.page.add_to_posted_change_list(this.pulldown);
    this.data_entry_object.poke_is_valid(true);
  }
          
} // end function
                                                                                     
// -------------------------------------------------------------------------------
// update the display to show the value of the current json object

dtack__interaction__cascading_json_choicelist_pulldown_c.prototype.update_display = function()
{
  var F = "update_display";

  this.pulldown.selectedIndex = 0;
  for(var index=1; index<this.pulldown.options.length; index++)
  {
  	var json_stored = this.pulldown.options[index].value;   
  	
  	var option_json_object = this.search_for_json_object_with_stored(json_stored);
  	
  	if (this.current_json_object &&
  	    option_json_object &&
  	    option_json_object.stored == this.current_json_object.stored)
  	{
  	  this.pulldown.selectedIndex = index;
  	  break;
	}
  }
    
  if (this.current_json_object && this.pulldown.selectedIndex == 0)
  {
    this.debug_verbose(F, "no option matches current stored" + this.vts(this.current_json_object.stored));
    this.current_json_object = null;
  }
          
} // end function                                                                                         