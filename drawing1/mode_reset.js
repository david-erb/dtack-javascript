// --------------------------------------------------------------------
// class representing the symbol drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_reset_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_reset_c.prototype.constructor = dtack_drawing_mode_reset_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_reset_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_reset_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_reset_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_reset_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";

										/* the page handles the reset */
  this.page.reset();
										/* we DO NOT become the new currently active mode nor stay down */
  return {
	"become_current": "no",
	"stay_down": "no"
	};

} // end method

