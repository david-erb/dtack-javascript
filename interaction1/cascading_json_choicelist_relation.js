// --------------------------------------------------------------------
// class representing the page being viewed in the browser

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_relation_c.prototype = new dtack__interaction__cascading_json_choicelist_base_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_relation_c.prototype.base = dtack__interaction__cascading_json_choicelist_base_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_relation_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_relation_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_relation_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_relation_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_relation_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__interaction__cascading_json_choicelist_relation_c.prototype.activate = function(
  page, 
  input_selector)
{
  var F = "activate";
  
										/* call the base class constructor helper */
  dtack__interaction__cascading_json_choicelist_relation_c.prototype.base.activate.call(
	this,
	page,
	input_selector);

  var that = this;
  
  this.$checkboxes = this.$input_selector.find("INPUT[type=checkbox]");
  
                                        // handle event where the pulldown value changes
  this.$checkboxes.change(
    function(jquery_event_object)
    {
                                        // let all listeners know that there is a new value on this object
      that.pull_triggers(that.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED, {jquery_event_object: jquery_event_object});
	}
  );

} // end method
                                                 
// -------------------------------------------------------------------------------
// set up the pulldown options to reflect the given set of json objects

dtack__interaction__cascading_json_choicelist_relation_c.prototype.poke_json_objects = function(
  json_objects,
  options)
{
  var F = "poke_json_objects";
  
  this.$input_selector.show();
  
                                        // remember the given set of json objects
  this.json_objects = json_objects;

  var json_storeds = new Array();
  if (json_objects)
  {
    for(var k in this.json_objects)
  	  json_storeds[this.json_objects[k].stored] = true;
  }
      
  var json_storeds_csv = json_storeds.join(", ");
  this.debug(F, "json_storeds_csv is " + this.vts(json_storeds_csv));
  
  var that = this;
  
  this.$checkboxes.each(
    function()
    {
      var $checkbox = $(this);
      var $container = $checkbox.closest(".input_and_label_mini_table");
      
      // that.debug(F, "checkbox " + $checkbox.attr("id") + " val is " + that.vts($checkbox.val())); 
      if (json_storeds[$checkbox.val()])
      {                         
        $container.show();
      }
      else
      {
        $container.hide();
      }

    }
  );
  
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

dtack__interaction__cascading_json_choicelist_relation_c.prototype.poke_current_value = function(value, options)
{
  var F = "poke_current_value";
  
  this.value = value;
          
} // end function
                                                                                     
// -------------------------------------------------------------------------------
// update the display to show the value of the current json object

dtack__interaction__cascading_json_choicelist_relation_c.prototype.update_display = function()
{
  var F = "update_display";
          
} // end function                                                                                         