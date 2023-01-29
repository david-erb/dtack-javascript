// --------------------------------------------------------------------
// class representing the drawing canvas

										// inherit the base methods and variables
dtack_drawing_canvas_c.prototype = new dtack_base2_c();
										// override the constructor
dtack_drawing_canvas_c.prototype.constructor = dtack_drawing_canvas_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_drawing_canvas_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_canvas_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(this, page.dtack_environment, F);

	this.dtack_environment.debug(F, "finished constructor");
  }
										/* remember the page which is hosting us */
  this.page = page;
										/* object describing common drawing mode attributes */
  this.definition_object = null;

  this.cursor = null;
										/* true if canvas is not to be interacted with */
  this.inert = false;

  this.raphael = undefined;
  this.raphael_x = 0;
  this.raphael_y = 0;
										/* the div on which raphael is based */
										// watchfrog #9
  this.raphael_div = null;

  this.mouseover_halo = undefined;
  this.mousedown_halo = undefined;
  this.mousemove_halo = undefined;

  this.vertices = new Array();
  this.edges = new Array();

  this.vertex_being_moved = undefined;
  this.edge_being_drawn = null;

  this.drawat_x = 0;
  this.drawat_y = 0;

  this.mouse_x = 0;
  this.mouse_y = 0;
										/* where the object was when the mouse first went down */
  this.mousedown_bbox = null;

  this.zoom_factor = 1.0;

} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_canvas_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";
										/* remember the server-supplied javascript object describing the canvas  */
  this.definition_object = definition_object;

  this.debug(F, "initializing");

} // end method


// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.use_raphael = function(raphael, raphael_x0, raphael_y0)
{
  this.raphael = raphael;
  this.raphael_x0 = raphael_x0;
  this.raphael_y0 = raphael_y0;

  this.mouseover_halo = this.raphael.rect(0, 0, 100, 100);
  this.mouseover_halo.attr({
	"stroke": "#0000FF"});
  this.mouseover_halo.hide();

  this.mousedown_halo = this.raphael.rect(0, 0, 100, 100);
  this.mousedown_halo.attr({
	"stroke": "#FF0000"});
  this.mousedown_halo.hide();

  this.mousemove_halo = this.raphael.rect(0, 0, 100, 100);
  this.mousemove_halo.attr({
	"stroke": "#FF00FF"});
  this.mousemove_halo.hide();

  var that = this;
  this.mouseover_halo.node.onmouseup = function(event_object) {that.mouseup("mouseover_halo", event_object);}
  this.mousedown_halo.node.onmouseup = function(event_object) {that.mouseup("mousedown_halo", event_object);}
  this.mousemove_halo.node.onmouseup = function(event_object) {that.mouseup("mousemove_halo", event_object);}

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.activate_edge = function(drawing_tool_definition_data)
{
  var F = "activate_edge";

										/* we have no edge or have submitted the edge already? */
  if (this.edge_being_drawn == null ||
      this.edge_being_drawn.has_been_ajaxed)
  {
	this.debug(F, "creating a new edge object");
										/* get a random uuid */
	var uuid = Math.uuid();

										/* emplace the DOM element for the primitive */
	var path = this.raphael.path();


										/* wrap an edge object around the primitive */
	var edge = new dtack_drawing_edge_c(this.page, uuid, path);

										/* add the edge to the canvas display list  */
	this.add_edge(edge);
										/* inherit the previous edge's definition */
	if (this.edge_being_drawn != null)
	{
	  edge.apply_definition_object(this.edge_being_drawn.definition_object);
	}

										/* make this the current edge */
	this.edge_being_drawn = edge;

  }
  else
  {
	this.debug(F, "not creating a new edge object");
  }
										/* apply the drawing tool's definition over the current edge */
  this.edge_being_drawn.apply_definition_data(drawing_tool_definition_data);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.add_vertex = function(vertex)
{
  var F = "add_vertex";

  this.vertices[vertex.uuid] = vertex;

} // end method


// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.add_edge = function(edge)
{
  var F = "add_edge";

  this.edges[edge.uuid] = edge;

} // end method


// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.clear_vertices = function()
{
  var F = "clear_vertices";

  for (var k in this.vertices)
  {
	this.vertices[k].raphael_object.remove();
	this.vertices[k] = undefined;
  }

  for (var k in this.edges)
  {
    this.edges[k].raphael_object.remove();
	this.edges[k] = undefined;
  }

  this.vertices = new Array();
  this.edges = new Array();

} // end method


// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.delete_vertex = function(vertex)
{
  var F = "delete_vertex";

										/* remove the vertex object from raphael */
  this.vertices[vertex.uuid].raphael_object.remove();

										/* remove all the footnotes too */
  this.vertices[vertex.uuid].delete_footnotes();

										/* remake the vertices array without the deleted one */
  var vertices = new Array();

  for (var k in this.vertices)
  {
	if (k != vertex.uuid)
	  vertices[k] = this.vertices[k];
  }

  this.vertices = vertices;

										/* reference this vertex's edge */
  var edge = this.edges[vertex.edge_uuid];
  if (edge != undefined)
  {
										/* tell the edge about the deleted vertex */
	edge.delete_vertex(vertex);
										/* render the edge without the deleted vertex */
    edge.render();
  }

										/* hide all the halos to do with the deleted vertex */
  this.mouseover_halo.hide();
  this.mousedown_halo.hide();
  this.mousemove_halo.hide();

} // end method

// -------------------------------------------------------------------------------
// delete all vertices on the same edge as the given one and delete the edge itself

dtack_drawing_canvas_c.prototype.delete_edge = function(vertex)
{
  var F = "delete_edge";

										/* remake the vertices array without the deleted one */
  var vertices = new Array();

  for (var k in this.vertices)
  {
	var k_vertex = this.vertices[k];

										/* this vertex is not on the edge? */
	if (k_vertex.edge_uuid != vertex.edge_uuid)
	{
										/* keep it in the list */
	  vertices[k] = this.vertices[k];
	}
										/* this vertex is on the edge? */
	else
	{
										/* remove the vertex object from raphael */
	  k_vertex.raphael_object.remove();
	}

  }
										/* keep the reduced list of vertices */
  this.vertices = vertices;


										/* remake the edges array without the deleted one */
  var edges = new Array();

  for (var k in this.edges)
  {
	var k_edge = this.edges[k];

										/* this is not the edge to be deleted? */
	if (k_edge.uuid != vertex.edge_uuid)
	{
										/* keep it in the list */
	  edges[k] = this.edges[k];
	}
										/* this is the edge to be deleted? */
	else
	{
										/* remove the edge object from raphael */
	  k_edge.raphael_object.remove();
	}

  }
										/* keep the reduced list of edges */
  this.edges = edges;

										/* hide all the halos to do with the deleted vertex */
  this.mouseover_halo.hide();
  this.mousedown_halo.hide();
  this.mousemove_halo.hide();

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.push_edge_vertices = function(vertices, edge_uuid)
{
  var F = "push_edge_vertices";

  for (var k in this.vertices)
  {
	var k_vertex = this.vertices[k];

	if (k_vertex.edge_uuid == edge_uuid)
	  vertices[k] = k_vertex;
  }


} // end method

// -------------------------------------------------------------------------------
// create and push N vertices into the given arrays

dtack_drawing_canvas_c.prototype.create_and_push_vertices = function(
  vertex,
  k_vertex,
  first_vertex_of_edge,
  count,
  vertices,
  new_vertices,
  edge_vertices)
{
  var F = "create_and_push_vertices";
										/* presume we are on the other endpoint of the segment */
  var end_vertex = k_vertex;

  var edge = this.page.canvas.edges[vertex.edge_uuid];

										/* next one found is part of a different edge? */
  if (k_vertex == null || k_vertex.edge_uuid != vertex.edge_uuid)
  {
										/* the edge we're doing is a closed figure? */
	if (edge.definition_object.dtack_auto_polygon == "yes")
	{
	  if (first_vertex_of_edge == null)
		return "cannot insert vertices until a closed figure has multiple vertices";

										/* the other endpoint of the segment is the first of the figure */
	  end_vertex = first_vertex_of_edge;

	  this.debug(F, "using first vertex of edge as end point");
	}
	else
	  return "cannot insert vertices because the vertex is at the end of a line";
  }


										/* for each new vertex wanted */
  for (var i=0; i<count; i++)
  {
										/* calculate the new inserted position */
	var x = Math.round(vertex.x + (i + 1.0) * (end_vertex.x - vertex.x) / (count + 1.0) + vertex.anchor_x);
	var y = Math.round(vertex.y + (i + 1.0) * (end_vertex.y - vertex.y) / (count + 1.0) + vertex.anchor_y);

										/* make a new vertex through the existing vertex's mode object */
	var new_vertex = vertex.mode_object.create_vertex(
	  Math.uuid(), vertex.edge_uuid, x, y);

										/* add the new vertex in sequence */
	vertices[new_vertex.uuid] = new_vertex;
										/* remember the new vertices which need to be ajaxed */
	new_vertices[new_vertex.uuid] = new_vertex;
										/* add new vertex to edge in sequence */
	edge_vertices[new_vertex.uuid] = new_vertex;

  }

  this.debug(F, "returning blank");

										// blank return here means ok
  return "";

} // end method

// -------------------------------------------------------------------------------
// insert N vertices after the given one
// return acknowledgement string

dtack_drawing_canvas_c.prototype.insert_vertices = function(vertex, count)
{
  var F = "insert_vertices";

  if (vertex.uuid == vertex.edge_uuid)
  {
	return "cannot insert vertices because the vertex is not part of an edge or closed figure";
  }
										/* get the vertex's edge object */
  var edge = this.page.canvas.edges[vertex.edge_uuid];
  if (edge == undefined)
  {
	return "cannot insert vertices because the vertex is not part of a known edge or closed figure";
  }

  var found = false;

  var first_vertex_of_edge = null;
										/* make a new vertices array which will contain the new ones too */
  var vertices = new Array();
										/* remember the new vertices which need to be ajaxed */
  var new_vertices = new Array();
										/* these will be the edge's vertices including the new ones */
  var edge_vertices = new Array();
										/* traverse all existing vertices */
  for (var k in this.vertices)
  {
										/* for short */
	var k_vertex = this.vertices[k];

										/* the last loop found the vertex to insert after? */
	if (found)
	{
	  var message = this.create_and_push_vertices(
		vertex,
		k_vertex,
		first_vertex_of_edge,
		count,
		vertices,
		new_vertices,
		edge_vertices);

	  if (message != "")
		return message;
										/* we've done the work we need to do */
	  found = false;
	}
										/* remember the first vertex of the edge we're inserting into */
	if (k_vertex.edge_uuid == vertex.edge_uuid &&
	    first_vertex_of_edge == null)
	  first_vertex_of_edge = k_vertex;

										/* remember when we found the one we want for the next loop */
	if (k_vertex.uuid == vertex.uuid)
	  found = true;
										/* add the existing vertex in sequence */
	vertices[k] = k_vertex;

										/* add existing vertex to edge in sequence */
	if (k_vertex.edge_uuid == vertex.edge_uuid)
	  edge_vertices[k_vertex.uuid] = k_vertex;

  }
										/* we're inserting before the very last vertex in the display list? */
  if (found)
  {
	//	return "cannot insert vertices because the vertex is at the end of a line and display list";
	var message = this.create_and_push_vertices(
	  vertex,
	  null,
	  first_vertex_of_edge,
	  count,
	  vertices,
	  new_vertices,
	  edge_vertices);

	if (message != "")
	  return message;

  }

										/* remember the new list of vertices */
  this.vertices = vertices;
										/* let the edge have its remade vertex list */
  edge.vertices = edge_vertices;
										/* render the edge including the new vertices */
  edge.render();

										/* start building a multi-command ajax xml */
  var xml =
	  "<request>" +
	  "<phpsessionid>" + this.phpsessionid + "</phpsessionid>" +
  "<commands>";

										/* let the mode object generate the xml to create the new vertices */
  xml += vertex.mode_object.create_vertices_xml(new_vertices);

										/* add the xml to properly order the edges within the vertex */
  xml +=
      "<command action=\"update_vertex_zorder\">" +
      "<vertices>";

										/* order the vertices within the edge */
  for (var k in edge_vertices)
  {
	xml += "<vertex uuid=\"" + k + "\" />";
  }

  xml +=
	"</vertices>" +
    "</command>";
										/* seal up the multi-command xml */
  xml +=
    "</commands>" +
	"</request>";

  this.ajax(xml);


  return count + (count == 1? " vertex": " vertices") + " inserted";
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.zorder = function(vertex, zorder)
{
  var F = "zorder";

  var k;
  var k_vertex;

  var edge = this.edges[vertex.edge_uuid];

  var zero_vertex = null;
  var prev_vertex = null;
  var next_vertex = null;
  var last_vertex = null;

  var found = false
										/* look for the bracketing vertices */
  for (k in this.vertices)
  {
										/* for short */
	k_vertex = this.vertices[k];
										/* remember the first one we encounter */
	if (zero_vertex == null)
	  zero_vertex = k_vertex;
										/* remember the first one after we find the one we want */
	if (found &&
	    (next_vertex == null || k_vertex.edge_uuid == next_vertex.edge_uuid) &&
	    k_vertex.edge_uuid != vertex.edge_uuid)
	{
	  next_vertex = k_vertex;
	}
										/* remember when we found the one we want */
	if (!found &&
	    k_vertex.edge_uuid == vertex.edge_uuid)
	{
	  found = true;
	}
										/* remember the last one before the one we want */
	if (!found)
	  prev_vertex = k_vertex;
										/* remember the last one we encounter */
	last_vertex = k_vertex;
  }
										/* make a new vertices array in the new order */
  var vertices = new Array();
  var copied = false;
  var raphael_object;

										/* * * * * * * * * * * * * * * * * * * * * * * * * */
  if (zorder == "zero" && zero_vertex == null)
    this.debug(F, "zorder is \"" + zorder + "\" but zero_vertex is null");
  else
  if (zorder == "zero" && zero_vertex != null && zero_vertex.edge_uuid == vertex.edge_uuid)
    this.debug(F, "zorder is \"" + zorder + "\" but zero_vertex and target vertex are the same");

  if (zorder == "zero" && zero_vertex != null && zero_vertex.edge_uuid != vertex.edge_uuid)
  {
										/* the zero vertex has an edge? */
	if (this.edges[zero_vertex.edge_uuid] == undefined)
	  raphael_object = zero_vertex.raphael_object;
	else
	  raphael_object = this.edges[zero_vertex.edge_uuid].raphael_object;

	this.debug(F, "inserting vertices with edge " + vertex.edge_uuid + " before vertex " + zero_vertex.uuid);

										/* there is a real edge involved? */
	if (edge != undefined)
	{
	  this.debug(F, "inserting edge " + edge.uuid + " before vertex " + zero_vertex.uuid);
	  edge.raphael_object.insertBefore(raphael_object);
	}

										/* insert all the edge's vertices before the zeroth one */
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid == vertex.edge_uuid)
	  {
		this.debug(F, "inserting vertex " + k_vertex.uuid + " before vertex " + zero_vertex.uuid);
		k_vertex.raphael_object.insertBefore(raphael_object);
	  }
	}

	this.push_edge_vertices(vertices, vertex.edge_uuid);
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid != vertex.edge_uuid)
		vertices[k] = this.vertices[k];
	}

	copied = true;
  }

										/* * * * * * * * * * * * * * * * * * * * * * * * * */
  if (zorder == "prev" && prev_vertex == null)
    this.debug(F, "zorder is \"" + zorder + "\" but prev_vertex is null");
  else
  if (zorder == "prev" && prev_vertex != null && prev_vertex.edge_uuid == vertex.edge_uuid)
    this.debug(F, "zorder is \"" + zorder + "\" but prev_vertex and target vertex are the same");

  if (zorder == "prev" && prev_vertex != null && prev_vertex.edge_uuid != vertex.edge_uuid)
  {
										/* the prev vertex has an edge? */
	if (this.edges[prev_vertex.edge_uuid] == undefined)
	  raphael_object = prev_vertex.raphael_object;
	else
	  raphael_object = this.edges[prev_vertex.edge_uuid].raphael_object;

	this.debug(F, "inserting " + vertex.edge_uuid + " before " + prev_vertex.edge_uuid);

										/* there is a real edge involved? */
	if (edge != undefined)
	{
	  edge.raphael_object.insertBefore(raphael_object);
	}

										/* insert all the edge's vertices before the previous one */
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid == vertex.edge_uuid)
	  {
		k_vertex.raphael_object.insertBefore(raphael_object);
	  }
	}

	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid == prev_vertex.edge_uuid)
		this.push_edge_vertices(vertices, vertex.edge_uuid);

	  if (k_vertex.edge_uuid != vertex.edge_uuid)
		vertices[k] = this.vertices[k];
	}

	copied = true;
  }


										/* * * * * * * * * * * * * * * * * * * * * * * * * */
  if (zorder == "next" && next_vertex == null)
    this.debug(F, "zorder is \"" + zorder + "\" but next_vertex is null");
  else
  if (zorder == "next" && next_vertex != null && next_vertex.edge_uuid == vertex.edge_uuid)
    this.debug(F, "zorder is \"" + zorder + "\" but next_vertex and target vertex are the same");

  if (zorder == "next" && next_vertex != null && next_vertex.edge_uuid != vertex.edge_uuid)
  {

	this.debug(F, "inserting " + vertex.edge_uuid + " after " + next_vertex.edge_uuid + "." + next_vertex.uuid);

	raphael_object = next_vertex.raphael_object;

										/* there is a real edge involved? */
	if (edge != undefined)
	{
	  edge.raphael_object.insertAfter(raphael_object);
	  raphael_object = edge.raphael_object;
	}

										/* insert all the edge's vertices after the next one */
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid == vertex.edge_uuid)
	  {
		k_vertex.raphael_object.insertAfter(raphael_object);
		raphael_object = k_vertex.raphael_object;
	  }
	}

	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid != vertex.edge_uuid)
		vertices[k] = this.vertices[k];
	  else
	  {
		this.push_edge_vertices(vertices, next_vertex.edge_uuid);
		this.push_edge_vertices(vertices, vertex.edge_uuid);
	  }
	}

	copied = true;
  }

										/* * * * * * * * * * * * * * * * * * * * * * * * * */
  if (zorder == "last" && last_vertex != null && last_vertex.edge_uuid != vertex.edge_uuid)
  {
	this.debug(F, "inserting " + vertex.edge_uuid + " after " + last_vertex.edge_uuid);

										/* the last vertex has an edge? */
	if (this.edges[last_vertex.edge_uuid] == undefined)
	  raphael_object = last_vertex.raphael_object;
	else
	  raphael_object = this.edges[last_vertex.edge_uuid].raphael_object;

	raphael_object = last_vertex.raphael_object;

										/* there is a real edge involved? */
	if (edge != undefined)
	{
	  edge.raphael_object.insertAfter(raphael_object);
	  raphael_object = edge.raphael_object;
	}

										/* insert all the edge's vertices after the last one */
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid == vertex.edge_uuid)
	  {
		k_vertex.raphael_object.insertAfter(raphael_object);
		raphael_object = k_vertex.raphael_object;
	  }
	}

	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  if (k_vertex.edge_uuid != vertex.edge_uuid)
		vertices[k] = this.vertices[k];
	}
										/* add the target vertex into the list last */
	this.push_edge_vertices(vertices, vertex.edge_uuid);

	copied = true;
  }
										/* * * * * * * * * * * * * * * * * * * * * * * * * */

										/* remember the newly ordered list of vertices */
  if (copied)
    this.vertices = vertices;

  var i = 0;

  if (false)
  {
	for (k in this.vertices)
	{
	  k_vertex = this.vertices[k];

	  this.debug(F, i + ". edge " + k_vertex.edge_uuid + " has vertex " + k_vertex.uuid);

	  i++;
	}
  }

  var edge_order = new Array();
  i = 0;
  for (k in this.vertices)
  {
	k_vertex = this.vertices[k];

	if (edge_order[k_vertex.edge_uuid] == undefined)
	  edge_order[k_vertex.edge_uuid] = i++;
  }

  var xml =
	  "<request>" +
	  "<phpsessionid>" + this.phpsessionid + "</phpsessionid>" +
	  "<commands>" +
      "<command action=\"update_edge_zorder\">" +
      "<edges>";

  for (k in edge_order)
  {
	xml += "<edge uuid=\"" + k + "\" />";
  }

  xml +=
	"</edges>" +
    "</command>" +
    "</commands>" +
	"</request>";

  this.ajax(xml);

} // end method


// --------------------------------------------------------------------
// use ajax to send the "create vertex" notification

dtack_drawing_canvas_c.prototype.ajax = function(xml, callback)
{
  var F = "ajax";

  if (callback == undefined)
    callback = "ajax_standard_php_callback";

  if (this.page.ajax_url != undefined)
  {
	var ajax = new dtack_ajax_c();

	var url = this.page.ajax_url;

// don't tack on debug=1 to ajax url
// watchfrog #12
	//if (this.dtack_environment.debug_level == 1)
	//  url += "?debug=1";

	this.debug(F, "sending ajax to server at url " + url);
	this.debug(F, xml);

	ajax.post(F, url, xml, this, callback);
  }
  else
  {
	this.debug(F, "not hitting ajax becaue this.page.ajax_url is undefined");
	this.page.reject_user_action(F, "not hitting ajax becaue this.page.ajax_url is undefined");
  }
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.halo_around = function(halo_string, vertex)
{
  var F = "halo_around";

  if (vertex == undefined)
    return;

  if (vertex.disable_halo == "yes")
    return;

  eval("var halo = " + halo_string + ";");
										/* reference the vertex's internal raphael object */
  var raphael_object = vertex.raphael_object;

  var bbox = raphael_object.getBBox();

  if (false)
  {
	this.debug(F,
	  halo_string +
      " raphael_object bbox is " +
      bbox.x + "," +
      bbox.y + " " +
      bbox.width + "x" +
      bbox.height);
  }

  halo.attr({
	"x": bbox.x,
	"y": bbox.y,
	"width": bbox.width,
	"height": bbox.height});

  halo.toFront();

  halo.show();

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.halo_mouseover = function(vertex, flag)
{
  var F = "halo_mouseover";

										/* when moving something, don't draw the mouseover halo */
  if (this.vertex_being_moved != undefined)
    return;

  if (this.inert)
  {
	this.mouseover_halo.hide();
	return;
  }

  if (flag)
  {
	this.halo_around("this.mouseover_halo", vertex);
  }
  else
  {
	this.mouseover_halo.hide();
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.halo_mousedown = function(vertex, event_object)
{
  var F = "halo_mousedown";

  if (this.inert)
  {
	return;
  }

  if (!event_object)
    event_object = window.event;

  this.mouse_x = dtack_utility_mouse_event_page_x(event_object);
  this.mouse_y = dtack_utility_mouse_event_page_y(event_object);
										/* reference the vertex's internal raphael object */
  var raphael_object = vertex.raphael_object;

										/* remember where the object was when the mouse first went down */
  this.mousedown_bbox = raphael_object.getBBox();
										/* remember the relative position inside the raphael object */
  this.drawat_x = this.mouse_x - this.raphael_x0 - this.mousedown_bbox.x;
  this.drawat_y = this.mouse_y - this.raphael_y0 - this.mousedown_bbox.y;

  if (false)
  this.debug(F,
    "mouse down " +
    " at " + this.mouse_x + ", " + this.mouse_y +
    " on raphael at " + this.raphael_x0 + ", " + this.raphael_y0 +
    " is relative " + this.drawat_x + ", " + this.drawat_y);


  this.halo_around("this.mousedown_halo", vertex);

  this.vertex_being_moved = vertex;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.mouseup = function(which, event_object)
{
  var F = "halo_mouseup";

  this.debug(F, "mouse up in " + this.which_name(which));

  if (this.inert)
  {
										/* forget the object we were dragging */
	this.vertex_being_moved = undefined;

										/* hide the mousedown halo */
	this.mousedown_halo.hide();
										/* hide the mousemove halo */
	this.mousemove_halo.hide();

    return;
  }

  if (this.vertex_being_moved != undefined)
  {
	if (this.cursor != null)
	  this.cursor.element.style.display = "none";

	var vertex = this.vertex_being_moved;

										/* forget the object we were dragging */
	this.vertex_being_moved = undefined;

										/* hide the mousedown halo */
	this.mousedown_halo.hide();
										/* hide the mousemove halo */
	this.mousemove_halo.hide();
										/* put the mouseover halo on the object */
	this.halo_around("this.mouseover_halo", vertex);
										/* remember where the object was when the mouse first went down */
	var bbox = vertex.raphael_object.getBBox();

	if (bbox.x != this.mousedown_bbox.x ||
	    bbox.y != this.mousedown_bbox.y)
	{

                                        // compensate for zoom factor when moving a vertex
                                        // watchfrog #137
      vertex.unzoomed_x = (vertex.x + vertex.anchor_x) / this.zoom_factor - vertex.anchor_x;
      vertex.unzoomed_y = (vertex.y + vertex.anchor_y) / this.zoom_factor - vertex.anchor_y;

	  this.debug(F, "vertex seems to have moved from " +
	    this.mousedown_bbox.x.toFixed(0) + "," + this.mousedown_bbox.y.toFixed(0) +
	    " to " + bbox.x.toFixed(0) + "," + bbox.y.toFixed(0) +
        " which unzoomed is " + vertex.unzoomed_x.toFixed(0) + "," + vertex.unzoomed_y.toFixed(0));

										/* then notify all the triggers attached to the vertex */
										/* give them the vertex that was clicked, not us (the canvas) */
	  vertex.pull_triggers("moved", vertex);

										/* let the vertex itself remember it moved */
	  vertex.moved_while_mouse_down = true;
	}

	if (false)
	{
	  if (!event_object)
        event_object = window.event;

	  event_object.cancelBubble = true;
	  if (event_object.stopPropagation)
	    event_object.stopPropagation();
	}
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.which_name = function(which)
{
  return which.classname + "[" + which.debug_identifier + "]";
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_canvas_c.prototype.halo_mousemove = function(which, event_object)
{
  var F = "halo_mousemove";

  if (this.vertex_being_moved == undefined)
  {
	this.mousemove_halo.hide();

    return;
  }

  if (this.inert)
  {
	this.mousemove_halo.hide();

    return;
  }

  if (!event_object)
    event_object = window.event;

  this.mouse_x = dtack_utility_mouse_event_page_x(event_object);
  this.mouse_y = dtack_utility_mouse_event_page_y(event_object);

  //this.debug(F, "mouse moved in " + this.which_name(which));

  this.vertex_being_moved.x = this.mouse_x - this.raphael_x0 - this.drawat_x;
  this.vertex_being_moved.y = this.mouse_y - this.raphael_y0 - this.drawat_y;

										/* reference the vertex's internal raphael object */
  var raphael_object = this.vertex_being_moved.raphael_object;

										/* tell raphael to move where the object is displayed */
  raphael_object.attr({
    "x": this.vertex_being_moved.x,
    "y": this.vertex_being_moved.y});
										/* also reposition any footnotes */
  this.vertex_being_moved.position_footnotes();

  //raphael_object.node.style.top = this.vertex_being_moved.x + "px";
  //raphael_object.node.style.left = this.vertex_being_moved.y + "px";

  if (this.cursor != null)
  {
	var cursor_x = this.mouse_x - 8;
	var cursor_y = this.mouse_y - 8;

	this.cursor.element.style.left = cursor_x + "px";
	this.cursor.element.style.top = cursor_y + "px";
	this.cursor.element.style.display = "block";
  }

										/* reference this vertex's edge */
  var edge = this.edges[this.vertex_being_moved.edge_uuid];
  if (edge != undefined)
  {
										/* render the edge including the new vertex */
    edge.render();
  }


										// while moving, always hide the mouseover halo
  this.mouseover_halo.hide();

										// while moving, always hide the mousedown halo
  this.mousedown_halo.hide();

										/* show the mousemove halo around the vertex */
  this.halo_around("this.mousemove_halo", this.vertex_being_moved);

										/* trigger anyone listening for the vertex's move */
										/* for example, the page will listen and hide any comreq input box */
  this.vertex_being_moved.pull_triggers(
	"moving",
    {
	  "vertex": this.vertex_being_moved
	});

  // this didn't help IE6's problem
  //event_object.cancelBubble = true;
  //if (event_object.stopPropagation)
  //  event_object.stopPropagation();

} // end method


// -------------------------------------------------------------------------------
// set the new zoom factor
// this is called from the page as it reacts to locator events

dtack_drawing_canvas_c.prototype.poke_zoom_factor = function(factor)
{
  var F = "poke_zoom_factor";

  this.zoom_factor = factor;

  var n_vertices = 0;
  for (var k in this.vertices)
  {
	var k_vertex = this.vertices[k];

	k_vertex.raphael_object.attr({
	  "x": (k_vertex.x + k_vertex.anchor_x) * factor - k_vertex.anchor_x,
	  "y": (k_vertex.y + k_vertex.anchor_y) * factor - k_vertex.anchor_y});

	k_vertex.position_footnotes();

	n_vertices++;
  }

  var n_edges = 0;
  for (var k in this.edges)
  {
	var k_edge = this.edges[k];

	if (k_edge.vertex_count > 0)
	{
	  k_edge.raphael_object.scale(
		factor,
		factor,
		0,
		0);
	}

	n_edges++;
  }

  // this.debug(F, "redrew " + n_vertices + " vertices in zoom factor " + factor);

} // end method
