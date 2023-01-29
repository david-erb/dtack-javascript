// --------------------------------------------------------------------
// class representing the linetype drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_linetype_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_linetype_c.prototype.constructor = dtack_drawing_mode_linetype_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_linetype_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_linetype_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_linetype_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_linetype_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";
										/* let the base object activate common things */
  this.parent.activate.call(this);

										/* update the current edge with this tool's definition data */
  this.page.canvas.activate_edge(
	this.definition_object.definition_data);

										/* we DO NOT become the new currently active mode but we stay down */
  return {
	"become_current": "no",
	"stay_down": "yes"
	};


} // end method
