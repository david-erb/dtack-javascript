// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__data_entry__checkboxes_c.prototype = new dtack__data_entry__field_c();

                                        // provide an explicit name for the base class
dtack__data_entry__checkboxes_c.prototype.base = dtack__data_entry__field_c.prototype;

										// override the constructor
dtack__data_entry__checkboxes_c.prototype.constructor = dtack__data_entry__checkboxes_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__data_entry__checkboxes_c(dtack_environment, selector, options, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__data_entry__checkboxes_c";

										/* call the base class constructor helper */
	dtack__data_entry__checkboxes_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	                                    // remember that the "selector" here is actually the container where the checkboxes live
	  selector, 
	  options,
	  classname != undefined? classname: F);
                             
	this.push_class_hierarchy(F);

  }
  
} // end constructor

// -------------------------------------------------------------------------------


dtack__data_entry__checkboxes_c.prototype.activate = function()
{
  var F = "activate";
                                        // let the base class activate
  dtack__data_entry__checkboxes_c.prototype.base.activate.call(this);
  
  this.$checkboxes = this.$selector.find(":checkbox");
  
	                                    // if there is a change on any radio button field descendant of the selector, revalidate immediately
	                                    // (remember selector is a DIV containing the radio buttons)
  var that = this;
  this.$checkboxes.change(
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
dtack__data_entry__checkboxes_c.prototype.peek_current_value = function()
{
  var F = "dtack__data_entry__checkboxes_c::peek_current_value";

  var value = "";
  
                                        // look through all the checkboxes to find the value of the ones that are checked
  this.$checkboxes.each(function() {if ($(this).prop("checked")) value = (value == ""? "": ",") + $(this).val();});
  
                                        // return current value of radio descendants in selector div
  return value;
} // end method

// -------------------------------------------------------------------------------
dtack__data_entry__checkboxes_c.prototype.poke_current_value = function(value)
{
  var F = "dtack__data_entry__checkboxes_c::poke_current_value";
  
  var values = value.split(",");
  
  var indices = new Object();
  
  for (var k in values)
  {
    indices[this.trim(values[k])] = true;
  }
  
                                        // look through all the checkboxes to find the one with the matching value
  this.$checkboxes.each(
    function() 
    {
      if (indices[$(this).attr("value")])
      {
        $(this).prop("checked", true);
	  }
    }
  );
} // end method
