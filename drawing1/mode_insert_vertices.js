// --------------------------------------------------------------------
// class representing the symbol drawing mode 

										// inherit the base methods and variables
dtack_drawing_mode_insert_vertices_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
dtack_drawing_mode_insert_vertices_c.prototype.constructor = dtack_drawing_mode_insert_vertices_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_insert_vertices_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_insert_vertices_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_insert_vertices_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_insert_vertices_c.prototype.activate = function(currently_active_mode_object)
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
// we are inserting vertices after an existing vertex
// when we are the current_mode_object, we get called when a vertex is clicked

dtack_drawing_mode_insert_vertices_c.prototype.onclick_vertex = function(event_object, vertex)
{
  var F = "onclick_vertex";

  this.debug(F, "click on " + this.which_name(vertex));

										/* let the base object do common things */
  this.parent.onclick_vertex(this, event_object, vertex);

										/* insert the vertices according to the mode */
  this.insert_vertices(vertex);
  

  return this;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_insert_vertices_c.prototype.insert_vertices = function(vertex)
{
  var F = "insert_vertices";

										/* tell the canvas to insert N vertices after the given vertex */
										/* the canvas will also take care of ajaxing the new vertices */
  var acknowledgement = this.page.canvas.insert_vertices(
	vertex, 
	this.definition_object2.dtack_vertex_count);

										/* let the page display acknowledgement of this */
  this.page.acknowledge_user_action(F, acknowledgement);

} // end method
