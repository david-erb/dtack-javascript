// --------------------------------------------------------------------
// class representing the symbol drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_zorder_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_zorder_c.prototype.constructor = dtack_drawing_mode_zorder_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_zorder_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_zorder_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_zorder_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_zorder_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";

										/* let the base object activate common things */
  this.parent.activate.call(this);


										/* we DO become the new currently active mode and stay down */
  return {
	"become_current": "yes",
	"stay_down": "yes"
	};

} // end method

// -------------------------------------------------------------------------------
// we are zordering an existing vertex
// when we are the current_mode_object, we get called when a vertex is clicked

dtack_drawing_mode_zorder_c.prototype.onclick_vertex = function(event_object, vertex)
{
  var F = "onclick_vertex";
										/* let the base object do common things */
  this.parent.onclick_vertex(this, event_object, vertex);

										/* tell canvas to do the zorder and ajax it */
  this.zorder(vertex);
  
  return this;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_zorder_c.prototype.zorder = function(vertex)
{
  var F = "zorder";

  this.page.canvas.zorder(vertex, this.definition_object2.zorder);

} // end method
