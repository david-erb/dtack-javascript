// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__interaction__cascading_json_autoid_pair_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_autoid_pair_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_autoid_pair_c.prototype.constructor = dtack__interaction__cascading_json_autoid_pair_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_autoid_pair_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_autoid_pair_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_autoid_pair_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_autoid_pair_c.prototype.activate = function(
  page, 
  json_objects, 
  subobjects_fieldname,
  input_selector1, 
  input_selector2)
{
  var F = "activate";
  
  this.page = page;
  this.subobjects_fieldname = subobjects_fieldname;

                                        // create the primary cascading pulldown
  this.select1 = new dtack__interaction__cascading_json_autoid_select_c(this.dtack_environment);
  this.select1.activate(page, input_selector1);
  
                                        // create the secondary cascading pulldown
  this.select2 = new dtack__interaction__cascading_json_autoid_select_c(this.dtack_environment);
  this.select2.activate(page, input_selector2);

                                        // provide the primary pulldown with its json objects
  this.select1.cascade(json_objects);
  
  var that = this;

                                        // handle event where the primary pulldown value changes
  this.select1.attach_trigger(
    this.select1.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED,
    function()
    {
      var json_object = that.select1.current_json_object;
      
                                        // the primary pulldown has a current value?
      if (json_object)
	  {
        that.select2.cascade(json_object[that.subobjects_fieldname]);
	  }
	                                    // the primary pulldown does not have a selected value?
	  else
      {
        that.select2.cascade(null);
	  }
	}
  );
  
                                                
} // end method

                                                                                                  