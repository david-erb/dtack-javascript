// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
harnesses__interaction_01__level1_interaction_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
harnesses__interaction_01__level1_interaction_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
harnesses__interaction_01__level1_interaction_c.prototype.constructor = harnesses__interaction_01__level1_interaction_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function harnesses__interaction_01__level1_interaction_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "harnesses__interaction_01__level1_interaction_c";

										/* call the base class constructor helper */
	harnesses__interaction_01__level1_interaction_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


harnesses__interaction_01__level1_interaction_c.prototype.activate = function(
  page, 
  json_objects, 
  input_selector, 
  level2_interaction)
{
  var F = "activate";
  
  this.page = page;
  this.json_objects = json_objects;
  this.input_selector = input_selector;
  this.level2_interaction = level2_interaction;
                     
  this.user_preference_variable = this.input_selector.replace("#", "") + "_autoid";

  var that = this;
                                    
  this.$input_selector = $(input_selector);
  
  this.assert("no pulldown on this page for selector " + input_selector, this.$input_selector.length > 0);
  this.assert("too many pulldowns on this page for selector " + input_selector, this.$input_selector.length == 1);
  
  this.pulldown = this.$input_selector.get(0);

  this.assert("unable to get level1 DOM element for selector " + input_selector, this.pulldown);
  
  this.pulldown.options.length = 0;

  this.pulldown.options[this.pulldown.options.length] = new Option( 
    "please select",
    "",
    true,
    true);

  this.pulldown.options.selectedIndex = 0;
  var user_preference_autoid = this.page.host_value("user_preferences.values." + this.user_preference_variable, "");
  
  this.debug_verbose(F, "user_preference_autoid is " + this.vts(user_preference_autoid));
                    
  this.current_json_object = this.json_objects[user_preference_autoid];
  
  for(var level1_autoid in this.json_objects)
  {
  	var json_object = this.json_objects[level1_autoid];
  	
    this.pulldown.options[this.pulldown.options.length] = new Option( 
      json_object.name,
      json_object.autoid,
      false,
      false);
  	
  	if (level1_autoid == user_preference_autoid)
  	{
      this.pulldown.options.selectedIndex = this.pulldown.options.length - 1;
	}
  }  
                                        // handle event where the pulldown value changes
  this.$input_selector.change(
    function(jquery_event_oject)
    {
      var level1_index = $(this).val();
      
      that.debug(F, "selected new level1 index " + that.vts(level1_index));
      
      if (level1_index == "")
      {
                                        // remember the selected value internally
        that.current_json_object = null;
                                    
        that.page.host_set("user_preferences.values." + that.user_preference_variable, "0");

        that.level2_interaction.cascade(null);

        that.update_display();
	  }
	  else
	  {
                                        // remember the selected value internally
        that.current_json_object = that.search_for_json_object_with_autoid(level1_index);
                                    
        that.page.host_set("user_preferences.values." + that.user_preference_variable, that.current_json_object.autoid);

        that.level2_interaction.cascade(that.current_json_object.sublevels);
      
        that.update_display();
	  }
	}
  );
  
                                         
  this.level2_interaction.activate(
    this.page,
    "SELECT#level2_pulldown");
                              
  if (this.current_json_object)
  {
    this.level2_interaction.cascade(this.current_json_object.sublevels);
  }
                                                 
} // end method

                                                                                                  
// -------------------------------------------------------------------------------
// apply current styles to map primitives

harnesses__interaction_01__level1_interaction_c.prototype.update_display = function()
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

harnesses__interaction_01__level1_interaction_c.prototype.search_for_json_object_with_autoid = function(json_autoid)
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

harnesses__interaction_01__level1_interaction_c.prototype.start_over = function()
{
  var F = "start_over";

  this.level1_interaction.start_over();
  
  this.pulldown.options.selectedIndex = 0;
  
  this.$input_selector.change();

} // end function