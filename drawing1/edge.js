// --------------------------------------------------------------------
// class representing a drawing edge 

										// inherit the base methods and variables
dtack_drawing_edge_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_drawing_edge_c.prototype.constructor = dtack_drawing_edge_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_drawing_edge_c(page, uuid, raphael_object)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_edge_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  page.dtack_environment, 
	  F);
  }

										/* remember the page who is housing us */
  this.page = page;
										/* remember the uuid of the edge */
  this.uuid = uuid;
  this.debug_identifier = uuid;

										/* the attributes of the edge */
  this.definition_object = {};
										/* whether this edge has been ajaxed or not */
  this.has_been_ajaxed = false;
										/* remember the dom element which represents this edge */
  this.raphael_object = raphael_object;

										/* initially don't fill */
  this.raphael_object.attr("fill-opacity", "0");

  this.vertices = new Array();
										/* initially don't close the path */
  this.auto_polygon = false;

  this.path_string = "";

  var that = this;

  this.raphael_object.node.onmouseover = function(event_object) {that.onmouseover(event_object);}
  this.raphael_object.node.onmouseout = function(event_object) {that.onmouseout(event_object);}

  this.raphael_object.node.onmousedown = function(event_object) {that.onmousedown(event_object);}
  this.raphael_object.node.onmouseup = function(event_object) {that.onmouseup(event_object);}

  this.raphael_object.node.onmousemove = function(event_object) {that.onmousemove(event_object);}
}

// -------------------------------------------------------------------------------
// add vertex to list of edge vertices

dtack_drawing_edge_c.prototype.add_vertex = function(vertex)
{
  var F = "add_vertex";
  
  this.vertices[vertex.uuid] = vertex;

  //this.debug(F, "added vertex " + vertex.uuid + ", length is now " + this.vertices.length);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.delete_vertex = function(vertex)
{
  var F = "delete_vertex";

										/* remake the vertices array without the deleted one */
  var vertices = new Array();

  for (var k in this.vertices)
  {
	if (k != vertex.uuid)
	  vertices[k] = this.vertices[k];
  }

  this.vertices = vertices;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.render = function()
{
  var F = "render";

  var first = null;
  var path = "";
  var n = 0;
  for (var k in this.vertices)
  {
	var vertex = this.vertices[k];

	if (first == null)
	{
	  path += "M";
	  first = vertex;
	}
	else
	  path += "L";
	
	//this.debug(F, "drawing vertex " + vertex.uuid);
	
	var x = vertex.x + vertex.anchor_x;
	var y = vertex.y + vertex.anchor_y;
	
	path += x + "," + y;

	n++;
  }
										/* we are in auto_polygon mode? */
  if (this.definition_object.dtack_auto_polygon == "yes")
  {
	if (n > 2)
	{
										/* let the path be closed */
	  // path += "Z";
	  var x = first.x + first.anchor_x;
	  var y = first.y + first.anchor_y;
	  
	  path += "L" + x + "," + y;
	  
	  //this.debug(F, n + "-vertex closed path is " + path);
	}
	else
	{
	  //this.debug(F, n + "-vertex unclosed path is " + path);
	}
  }
  else
  {
	//this.debug(F, "unclosed path is " + path);
  }
  
  this.raphael_object.attr("path", path);

  this.vertex_count = n;

} // end method


// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.apply_definition_data = function(definition_data)
{
  var F = "apply_definition_data";

  definition_object = new Object();

  if (definition_data != "")
  {
	eval("definition_object = {" + definition_data + "};");

	this.apply_definition_object(definition_object);
  }
  else
  {
	//	this.debug(F, "not applying any edge definitions because definition data is blank");
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.apply_definition_object = function(definition_object)
{
  var F = "apply_definition_object";

  for (var k in definition_object)
  {
	this.definition_object[k] = definition_object[k];

	if (k == "dtack_auto_polygon")
	{
	 
	}
	else
	{
	  //this.debug(F, "applying " + k + " " + definition_object[k]);

	  this.raphael_object.attr(k, definition_object[k]);
	}
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.onmouseover = function(event_object)
{
  var F = "onmouseover";

  //this.page.canvas.halo_mouseover(this, true);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.onmouseout = function(event_object)
{
  var F = "onmouseout";

  //this.page.canvas.halo_mouseover(this, false);
} // end method

// -------------------------------------------------------------------------------
// mouse down over the edge object

dtack_drawing_edge_c.prototype.onmousedown = function(event_object)
{
  var F = "onmousedown";
 
  //this.page.canvas.halo_mousedown(this, event_object);

										/* let the mode object have the event  */
  if (this.page.currently_active_mode_object != undefined)
  {
	this.page.currently_active_mode_object.onmousedown(event_object);
  }

} // end method

// -------------------------------------------------------------------------------
// mouseup might happen over this edge but is not specific to it
dtack_drawing_edge_c.prototype.onmouseup = function(event_object)
{
  var F = "onmouseup";

  this.page.canvas.mouseup(this, event_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_edge_c.prototype.onmousemove = function(event_object)
{
  var F = "onmousemove";

  this.page.canvas.halo_mousemove(this, event_object);

} // end method
