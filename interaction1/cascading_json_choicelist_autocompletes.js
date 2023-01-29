// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype.constructor = dtack__interaction__cascading_json_choicelist_autocompletes_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__interaction__cascading_json_choicelist_autocompletes_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__interaction__cascading_json_choicelist_autocompletes_c";

										/* call the base class constructor helper */
	dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype.activate = function(
  page, 
  json_objects, 
  subobjects_fieldname,
  input_selector1, 
  initial1_value, 
  input_selector2,
  initial2_value)
{
  var F = "activate";
  
  this.page = page;
  this.json_objects = json_objects;
  this.subobjects_fieldname = subobjects_fieldname;

                                        // create the primary cascading pulldown
  this.select1 = new dtack__interaction__cascading_json_choicelist_autocomplete_c(this.dtack_environment);
  this.select1.activate(page, input_selector1);
  this.initial1_value = initial1_value;
  
                                        // create the secondary cascading pulldown
  this.select2 = new dtack__interaction__cascading_json_choicelist_autocomplete_c(this.dtack_environment);
  this.select2.activate(page, input_selector2);
  this.initial2_value = initial2_value;

  var that = this;
  this.is_autocomplete1_created = false;
  this.is_autocomplete2_created = false;
  
  this.select1.$input_selector.on("autocompletecreate", 
    function(event, ui) 
    {
                                        // provide the primary autocomplete with its json objects
      that.select1.cascade(that.json_objects);
      
      that.select1.poke_current_json_stored(that.initial1_value);

      that.is_autocomplete1_created = true;
      
      that.cascade();
    } 
  );
  
  this.select2.$input_selector.on("autocompletecreate", 
    function(event, ui) 
    {

      that.is_autocomplete2_created = true;
      
      that.cascade();

      that.select2.poke_current_json_stored(that.initial2_value);
    } 
  );
  
  var that = this;

                                        // handle event where the primary pulldown value changes
  this.select1.attach_trigger(
    this.select1.CONSTANTS.EVENTS.SELECTED_ITEM_CHANGED,
    function()
    {
      that.cascade();
	}
  );
  
                                                
} // end method

// -------------------------------------------------------------------------------

dtack__interaction__cascading_json_choicelist_autocompletes_c.prototype.cascade = function()
{
  var F = "cascade";
  
  if (this.is_autocomplete1_created && 
      this.is_autocomplete2_created)
  {
    var json_object = this.select1.current_json_object;
      
                                        // the primary pulldown has a current value?
    if (json_object)
    {
      this.select2.cascade(json_object[this.subobjects_fieldname]);
    }
	                                    // the primary pulldown does not have a selected value?
    else
    {
      this.select2.cascade(null);
    }
  }
  
                                                
} // end method

                                                                                                  