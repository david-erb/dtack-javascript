// --------------------------------------------------------------------
// class representing the symbol drawing mode 

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_drawing_mode_symbol_c.prototype = new dtack_drawing_mode_base_c();
										// override the constructor
  dtack_drawing_mode_symbol_c.prototype.constructor = dtack_drawing_mode_symbol_c;
										/* remember who the base class is */
  //dtack_drawing_mode_symbol_c.prototype.parent = dtack_drawing_mode_base_c.prototype;
}
catch(exception)
{
  if (exception.name != undefined)
	window.status = exception.name + ": " + exception.message;
  else
	window.status = exception;
}

// -------------------------------------------------------------------------------
// constructor

function dtack_drawing_mode_symbol_c(page)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_mode_symbol_c";

										// initilialize the base instance variables
	dtack_drawing_mode_base_c.prototype.constructor.call(this, page, F);
	
	this.parent = dtack_drawing_mode_base_c.prototype;
  }

} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_mode_symbol_c.prototype.initialize = function(definition_object)
{
  var F = "initialize";

										/* let the base object initialize common things */
  this.parent.initialize.call(this, definition_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_symbol_c.prototype.activate = function(currently_active_mode_object)
{
  var F = "activate";
										// this mode has no specific acknowledgement?
  if (this.definition_object.acknowledge_user_action == "")
  {
	this.definition_object.acknowledge_user_action =
	  "click in the drawing area to draw";
  }
										/* let the base object activate common things */
  this.parent.activate.call(this);
										/* update the current edge with this tool's definition data */
  this.page.canvas.activate_edge(
	this.definition_object.definition_data);

										/* redraw the current path with the new attributes */
  this.page.canvas.edge_being_drawn.render();


										/* we DO become the new currently active mode and we stay down */
  return {
	"become_current": "yes",
	"stay_down": "yes"
	};


} // end method

// -------------------------------------------------------------------------------
// we are originating a brand new, never before seen vertex

dtack_drawing_mode_symbol_c.prototype.onmousedown = function(event_object)
{
  var F = "onmousedown";
										/* let the base object onmousedown common things */
  this.parent.onmousedown.call(this, event_object);

										/* get a random uuid */
  var uuid = Math.uuid();

  var edge = null;
										/* symbols with no edge get their own uuid as edge_uuid */
  var edge_uuid = uuid;

										/* edges are not precluded in this symbol mode? */
  if (this.definition_object2.dtack_auto_edge != "no")
  {
										/* we have a current edge definition? */
	edge = this.page.canvas.edge_being_drawn;
	if (edge != null)
	  edge_uuid = edge.uuid;
  }

										/* draw the symbol where the mouse was clicked */
  var vertex = this.draw(uuid, edge_uuid, this.drawat_x, this.drawat_y);

  if (edge != null)
  {
										/* render the edge including the new vertex */
    edge.render();
  }

  var factor = this.page.canvas.zoom_factor;

  var x2 = Math.round((vertex.x + vertex.anchor_x) / factor - vertex.anchor_x);
  var y2 = Math.round((vertex.y + vertex.anchor_y) / factor - vertex.anchor_y);

  var x2 = Math.round((vertex.x + vertex.anchor_x) / factor);
  var y2 = Math.round((vertex.y + vertex.anchor_y) / factor);

  this.debug(F, "creating vertex at " +
    x2 + "," + y2 +
    " which is the zoom of " +
    vertex.x + "," + vertex.y +
	" at factor " + factor);

										/* let the vertex remember its position under the Zoom/pan */
  vertex.x = x2 - vertex.anchor_x;
  vertex.y = y2 - vertex.anchor_y;

  vertex.definition_object = new Object();

										/* this mode makes a footnote when you doubleclick its vertexes? */
  if (this.definition_object2.dblclick_for_footnotes == "yes")
  {
										/* let the page give us the next available footnote label */
	var footnote_label = this.page.peek_next_footnote_label();

										/* add a blank footnote to the vertex we just made */
										// adding vertex footnotes while loading is done in the page class
										// eztask #6689: add a blank footnote to the footnote type vertices immediately when they are made
										// watchfrog #13
	vertex.add_footnote({
	  "label": footnote_label,
										/* allow ability to position label inside or outside vertex */
	  "label_x_offset_percent": this.definition_object2.label_x_offset_percent,
	  "label_y_offset_percent": this.definition_object2.label_y_offset_percent,
	  "footnote_text": "",
	  "footnote_type": ""
	  });
  }

										/* let the page apply some vertex definition fields like "created_by" */
										/* do this after the footnotes are set up */
  this.page.vertex_created_by_mouse(this, vertex);

										/* notify ajax of the new vertex */
  this.ajax_create_vertex(
	uuid,
	edge_uuid,
	x2,
	y2,
	this.definition_object.autoid);

  return this;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_mode_symbol_c.prototype.draw = function(uuid, edge_uuid, x, y)
{
  var F = "draw";

  //this.debug(F, "node_url is " + this.definition_object.node_url);
  
										/* create a vertex object and its raphael primitive */
  var vertex = this.create_vertex(uuid, edge_uuid, x, y)

										/* add the vertex to the canvas display list   */
  this.page.canvas.add_vertex(vertex);
										/* get the vertex's edge object */
  var edge = this.page.canvas.edges[edge_uuid];
  if (edge)
  {
	edge.add_vertex(vertex);
  }

  return vertex;

} // end method


// -------------------------------------------------------------------------------
// this function is called after a mouse click and when synthetically inserting nodes

dtack_drawing_mode_symbol_c.prototype.create_vertex = function(uuid, edge_uuid, x, y)
{
  var F = "create_vertex";

  //this.debug(F, "node_url is " + this.definition_object.node_url);
  
  var xe = parseInt(this.definition_object.node_xe);
  var ye = parseInt(this.definition_object.node_ye);

  var anchor_x = Math.round(xe/2.0);
  var anchor_y = Math.round(ye/2.0);
										/* emplace the DOM element for the primitive */
  var symbol = this.page.canvas.raphael.image(
	this.definition_object.node_url, 
	x - anchor_x, 
	y - anchor_y,
	xe, ye);                              

										/* wrap an vertex object around the primitive */
  var vertex = new dtack_drawing_vertex_c(this.page, uuid, edge_uuid, symbol, anchor_x, anchor_y);

										/* let the vertex remember the mode object which created it */
										/* (used when making a clone) */
  vertex.mode_object = this;

  vertex.x = x - anchor_x;
  vertex.y = y - anchor_y;

  var that = this;
										/* the vertex should tell us when it gets moved */
  vertex.attach_trigger(
	"moved", 
	function(vertex) {return that.vertex_moved(vertex);});

										/* the vertex should tell us when it gets double-clicked */
  vertex.attach_trigger(
	"dblclicked", 
	function(compound) {return that.vertex_dblclicked(compound.event_object, compound.vertex);});

  return vertex;

} // end method

// -------------------------------------------------------------------------------
// the philosophy is that a double-click interacts with the specific vertex instance
// to implement this, the mode object which creates the vertex will listen for the double click

dtack_drawing_mode_symbol_c.prototype.vertex_dblclicked = function(event_object, vertex)
{
  var F = "vertex_dblclicked";

										/* this symbol is defined to open notes on double click? */
  if (this.definition_object2.dblclick_for_footnotes == "yes")
  {
	if (!event_object)
	  event_object = window.event;

	var x = dtack_utility_mouse_event_page_x(event_object);
	var y = dtack_utility_mouse_event_page_y(event_object);
	
	this.page.edit_footnote(x, y, vertex);
  }
  else
  {
	this.debug(F, "taking no action on the double-click");
  }

} // end method

