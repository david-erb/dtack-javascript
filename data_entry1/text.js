// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__text_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__text_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__text_c.prototype.constructor = dtack__data_entry__text_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__text_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__text_c";

										/* call the base class constructor helper */
	dtack__data_entry__text_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, 
	  options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__data_entry__text_c.prototype.activate = function()
{
  var F = "activate";
                                                            // let the base class activate
  dtack__data_entry__text_c.prototype.base.activate.call(this);

	                                    // if there is a change on the text field, revalidate immediately
 	var that = this;
    this.$selector.change(
      function(jquery_event_object)
      {
                                        // let deriving class have a crack at the change
        that.change(jquery_event_object);
      	                                // validate and render validation failure or success
      	that.validate();
      }
    );

} // end method

// -------------------------------------------------------------------------------
// validate and render validation failure or success

dtack__data_entry__text_c.prototype.validate = function(options)
{
  var F = "validate";
                                                            
                                        // let the base class validate
  var is_valid = dtack__data_entry__text_c.prototype.base.validate.call(this, options);
  
  if (is_valid)
  {
  	var $other_textbox = this.option_value(this.constructor_options, "$other_textbox", null);
    //this.debug_verbose(F, "[OTHER] $other_textbox is " + this.vts($other_textbox));
  	if ($other_textbox)
  	{
      if (this.peek_current_value() != $other_textbox.val())
      {
        this.debug_verbose(F, "[OTHER] current value " + this.vts(this.peek_current_value()) + " does not match " + this.vts($other_textbox.val()));
      	this.poke_is_valid(false, "confirmation does not match");
      	return false;
	  }
	}
  }
  
  return this.is_valid;
  
} // end method
