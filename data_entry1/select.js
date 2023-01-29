// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__select_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__select_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__select_c.prototype.constructor = dtack__data_entry__select_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__select_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__select_c";

										/* call the base class constructor helper */
	dtack__data_entry__select_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
	  
  }
  
} // end constructor



// -------------------------------------------------------------------------------


dtack__data_entry__select_c.prototype.activate = function()
{
  var F = "dtack__data_entry__select_c::activate";
  	                                              
  this.debug_verbose(F, "activating " + this.selector + " length " + this.$selector.length);

                                                 // let the base class activate
  dtack__data_entry__select_c.prototype.base.activate.call(this);

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
