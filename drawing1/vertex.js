// --------------------------------------------------------------------
// class representing a drawing vertex

										// inherit the base methods and variables
dtack_drawing_vertex_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_drawing_vertex_c.prototype.constructor = dtack_drawing_vertex_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_drawing_vertex_c(page, uuid, edge_uuid, raphael_object, anchor_x, anchor_y, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_vertex_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  page.dtack_environment, 
	  classname != undefined? classname: F);
  }

										/* remember the page who is housing us */
  this.page = page;
										/* remember the uuid of the vertex */
  this.uuid = uuid;
  this.debug_identifier = uuid;

										/* remember the uuid of the edge */
  this.edge_uuid = edge_uuid;
										/* remember the dom element which represents this vertex */
  this.raphael_object = raphael_object;
  this.raphael_object_bbox = this.raphael_object.getBBox()

  this.set = this.page.canvas.raphael.set();
  this.set.push(this.raphael_object);

  this.x = 0;
  this.y = 0;

  this.anchor_x = anchor_x;
  this.anchor_y = anchor_y;


  this.footnotes = new Array();

  this.native_events(this.raphael_object);

										/* the mode object which created us (used when making a clone) */
  this.mode_object = null;

  this.moved_while_mouse_down = false;

}
// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.native_events = function(raphael_object)
{
  var F = "native_events";

  var that = this;

  raphael_object.node.onclick = function(event_object) {return that.onclick(event_object);}
  raphael_object.node.ondblclick = function(event_object) {return that.ondblclick(event_object);}

  raphael_object.node.onmouseover = function(event_object) {return that.onmouseover(event_object);}
  raphael_object.node.onmouseout = function(event_object) {return that.onmouseout(event_object);}

  raphael_object.node.onmousedown = function(event_object) {return that.onmousedown(event_object);}
  raphael_object.node.onmouseup = function(event_object) {return that.onmouseup(event_object);}

  raphael_object.node.onmousemove = function(event_object) {return that.onmousemove(event_object);}
}

// -------------------------------------------------------------------------------
// add a footnote to this vertex
// tries to draw the footnote's label in the center

dtack_drawing_vertex_c.prototype.add_footnote = function(footnote)
{
  var F = "add_footnote";

										/* add to the footnotes list of this vertex */
  this.footnotes[this.footnotes.length] = footnote;

										/* don't show footnotes if this feature is disabled */
  if (this.show_label != "inside")
    return;
 
										/* make the footnote as a raphael primitive */
  footnote.label_raphael_object = this.page.canvas.raphael.text(
	this.x,
	this.y,
	footnote.label);

										/* add the footnote to the raphael set for quick moving */
  this.set.push(footnote.label_raphael_object);

										/* footnote triggers same events as the vertex itself */
										/* this does not solve the problem that a vertex gets a mouseout event */
										/* when the mouse moves over its own label */
  this.native_events(footnote.label_raphael_object);

										/* also reposition all footnotes */
  this.position_footnotes();

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.position_footnotes = function()
{
  var F = "position_footnotes";

										/* don't show footnotes if this feature is disabled */
  if (this.show_label != "inside")
    return;

  var n = 0;
  for (var k in this.footnotes)
  {
	var footnote = this.footnotes[k];

										/* allow ability to position label inside or outside vertex */
	var x_offset_percent = parseFloat(footnote.label_x_offset_percent);
	if (isNaN(x_offset_percent))
	{
	  //	this.debug(F, "\"" + footnote.label_x_offset_percent + "\" is NaN");
	  x_offset_percent = 50.0;
	}
	else
	{
	  //this.debug(F, "\"" + footnote.label_x_offset_percent + "\" is " + x_offset_percent);
	}

	var y_offset_percent = parseFloat(footnote.label_y_offset_percent);
	if (isNaN(y_offset_percent))
	  y_offset_percent = 50.0;
 
	this.raphael_object_bbox = this.raphael_object.getBBox()

	var x = this.raphael_object_bbox.x + Math.round(this.raphael_object_bbox.width * x_offset_percent / 100.0);
	var y = this.raphael_object_bbox.y + Math.round(this.raphael_object_bbox.height * y_offset_percent / 100.0);

	footnote.label_raphael_object.attr(
      {
	    "x": x, 
	    "y": y
  	  }
	);

	//this.debug(F, "positioned footnote " + n + " to " + x + "," + y);

	n++;
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.delete_footnotes = function()
{
  var F = "delete_footnotes";

  var n = 0;
  for (var k in this.footnotes)
  {
	var footnote = this.footnotes[k];

	if (footnote.label_raphael_object != undefined)
	  footnote.label_raphael_object.remove();
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.onclick = function(event_object)
{
  var F = "onclick";

  if (!this.moved_while_mouse_down)
  {
										/* the page has a mode going on? */
	if (this.page.currently_active_mode_object != undefined)
	{
										/* let the mode know that this vertex was clicked */
										/* the mode might be "delete_vertex" for example */
	  this.page.currently_active_mode_object.onclick_vertex(event_object, this);
	}

										/* also trigger any listeners */
										/* clicks on comreq vertices are handled this way instead of the above*/
										/* trigger any listeners */
	this.pull_triggers(
	  "clicked", 
      {
		"event_object": event_object,
		"vertex": this
	  });

  }

} // end method

// -------------------------------------------------------------------------------
// the philosophy is that a double-click interacts with the specific vertex instance
// to implement this, the mode object which creates the vertex will listen for the double click

dtack_drawing_vertex_c.prototype.ondblclick = function(event_object)
{
  var F = "ondblclick";

										/* trigger any listeners */
  this.pull_triggers(
	"dblclicked", 
    {
	  "event_object": event_object,
	  "vertex": this
	});

  return false;
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.onmouseover = function(event_object)
{
  var F = "onmouseover";

  this.page.canvas.halo_mouseover(this, true);

										/* trigger any listeners */
  this.pull_triggers(
	"mouseover", 
    {
	  "event_object": event_object,
	  "vertex": this
	});

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.onmouseout = function(event_object)
{
  var F = "onmouseout";

  this.page.canvas.halo_mouseover(this, false);

										/* trigger any listeners */
  this.pull_triggers(
	"mouseout", 
    {
	  "event_object": event_object,
	  "vertex": this
	});

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.onmousedown = function(event_object)
{
  var F = "onmousedown";

  this.moved_while_mouse_down = false;

  this.page.canvas.halo_mousedown(this, event_object);

  return false;
} // end method

// -------------------------------------------------------------------------------
// mouseup might happen over this vertex but is not specific to it
dtack_drawing_vertex_c.prototype.onmouseup = function(event_object)
{
  var F = "onmouseup";

  this.page.canvas.mouseup(this, event_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_vertex_c.prototype.onmousemove = function(event_object)
{
  var F = "onmousemove";

  this.page.canvas.halo_mousemove(this, event_object);

} // end method
