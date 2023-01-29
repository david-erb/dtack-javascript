// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__checkbox_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__checkbox_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__checkbox_c.prototype.constructor = dtack__data_entry__checkbox_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__checkbox_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__checkbox_c";

										/* call the base class constructor helper */
	dtack__data_entry__checkbox_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  selector, options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);
  }
  
} // end constructor


// -------------------------------------------------------------------------------

dtack__data_entry__checkbox_c.prototype.activate = function()
{
  var F = "activate";
                                                            // let the base class activate
  dtack__data_entry__checkbox_c.prototype.base.activate.call(this);

} // end method


// -------------------------------------------------------------------------------
dtack__data_entry__checkbox_c.prototype.peek_current_value = function()
{
  if (this.$selector.prop("checked"))
    return 1;
  else
    return 0;
} // end method

// -------------------------------------------------------------------------------
dtack__data_entry__checkbox_c.prototype.poke_current_value = function(value)
{
  this.$selector.prop("checked", !!$value);
} // end method
