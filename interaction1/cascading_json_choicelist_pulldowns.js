// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_pulldowns_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_pulldowns_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_pulldowns_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	                    	  
    this.CONSTANTS = {}
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.CASCADED1 = "module_wap__office_admin__staff_attributes_page_utility_c::CASCADED1";
    this.CONSTANTS.EVENTS.CASCADED2 = "module_wap__office_admin__staff_attributes_page_utility_c::CASCADED2";
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.activate = function(
  page, 
  json_objects, 
  input_selector1, 
  initial1_value, 
  subobjects1_fieldname,
  input_selector2,
  initial2_value, 
  subobjects2_fieldname,
  input_selector3,
  initial3_value)
{
  var F = "activate";
  
  this.debug_verbose(F, "activating with initial1_value " + this.vts(initial1_value));

  this.page = page;
  this.json_objects= json_objects;
  this.subobjects1_fieldname = subobjects1_fieldname;
  this.subobjects2_fieldname = subobjects2_fieldname;

                                        // create the primary cascading pulldown
  this.select1 = new dtack__interaction__cascading_json_choicelist_pulldown_c(this.dtack_environment);
  this.select1.activate(page, input_selector1);
  this.select1.poke_json_objects(this.json_objects);
  //if (initial1_value != "")
    this.select1.poke_current_json_stored(initial1_value);
  
                                        // create the secondary cascading pulldown
  this.select2 = new dtack__interaction__cascading_json_choicelist_pulldown_c(this.dtack_environment);
  this.select2.activate(page, input_selector2);
  this.poke_json2_objects();
  //if (initial2_value != "")
    this.select2.poke_current_json_stored(initial2_value);
  
  if (input_selector3)
  {
                                        // create the tertiary cascading pulldown
    this.select3 = new dtack__interaction__cascading_json_choicelist_pulldown_c(this.dtack_environment);
    this.select3.activate(page, input_selector3);
    this.poke_json3_objects();
    //if (initial3_value != "")
      this.select3.poke_current_json_stored(initial3_value);
  }
                                              
  var that = this;

                                        // handle event where the primary pulldown value changes
  this.select1.attach_trigger(
    this.select1.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED,
    function(trigger_object)
    {
      that.poke_json2_objects({is_operator_instigated: that.is_operator_trigger(trigger_object)});
      that.poke_json3_objects({is_operator_instigated: that.is_operator_trigger(trigger_object)});
                                        // notify all listeners that a cascade has happened
      that.pull_triggers(that.CONSTANTS.EVENTS.CASCADED1, trigger_object);
	}
  );
  
                                        // handle event where the primary pulldown value changes
  this.select2.attach_trigger(
    this.select2.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED,
    function(trigger_object)
    {
      that.poke_json3_objects({is_operator_instigated: that.is_operator_trigger(trigger_object)});
                                        // notify all listeners that a cascade has happened
      that.pull_triggers(that.CONSTANTS.EVENTS.CASCADED2, trigger_object);
	}
  );
                                                
} // end method
                                                                         
                                                                 
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.is_operator_trigger = function(trigger_object)
{
  var F = "is_operator_trigger";

  var r = trigger_object.jquery_event_object? "yes": "no"; 
  
  //this.debug(F, "trigger_object " + this.option_keys_text(trigger_object) + " returning " + r);
  
  return r;
                                            
} // end method

                                                                 
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.poke_json2_objects = function(options)
{
  var F = "poke_json2_objects";

  this.debug_verbose(F, "options " + this.option_keys_text(options));

  if (this.select1.current_json_object)
    this.select2.poke_json_objects(this.select1.current_json_object[this.subobjects1_fieldname], options);
  else
    this.select2.poke_json_objects(null, options);
                                            
} // end method

                                                                 
// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_pulldowns_c.prototype.poke_json3_objects = function(options)
{
  var F = "poke_json3_objects";
  
  this.debug_verbose(F, "options " + this.option_keys_text(options));

  if (this.select3)
  {
    if (this.select2.current_json_object)
    {
      this.select3.poke_json_objects(this.select2.current_json_object[this.subobjects2_fieldname], options);
	}
    else
    {
      this.select3.poke_json_objects(null, options);
	}
  }
                                                
} // end method

                                                                       