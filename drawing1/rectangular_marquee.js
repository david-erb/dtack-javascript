// --------------------------------------------------------------------
// class representing a drawing rectangular_marquee

										// inherit the base methods and variables
dtack_drawing_rectangular_marquee_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_drawing_rectangular_marquee_c.prototype.constructor = dtack_drawing_rectangular_marquee_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_drawing_rectangular_marquee_c(canvas, raphael, wallpaper, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_drawing_rectangular_marquee_c";

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this,
	  canvas.dtack_environment,
	  classname != undefined? classname: F);
  }

										/* remember the canvas who is housing us */
  this.canvas = canvas;

  this.inert = false;
										/* rectangle to constrain our motion on the canvas */
  this.keep_inside_region = null;
										/* remember the dom element which represents this rectangular_marquee */
  this.raphael = raphael;
										/* wallpaper object representing the background image already loaded */
  this.wallpaper = wallpaper;
										/* initial rectangle whose aspect ratio needs to be maintained */
  this.initial_rectangle = null;

  this.primitive_name_being_moved = undefined;

  this.grab_handle_size = 6;
										/* limit the smallest size the box can absolutely be */
  this.minimum_redbox_side_length = 20;
										/* limit the maximum zoom factor we will deliver */
  this.minimum_redbox_side_ratio = 4;

  this.mouse_x = 0;
  this.mouse_y = 0;
  this.grabbed_x = 0;
  this.grabbed_y = 0;
										/* where the object was when the mouse first went down */
  this.mousedown_bbox = null;

  this.public_region = new Object();

  var that = this;

  this.primitives = new Array();

  this.primitives["interior"] = this.raphael.rect(0, 0, 100, 100);
  this.primitives["interior"].node.onmousedown = function(event_object) {return that.onmousedown(event_object, "interior");}

  this.primitives["edge_right"] = this.raphael.rect(0, 0, 100, 100);
  this.primitives["edge_right"].node.onmousedown = function(event_object) {return that.onmousedown(event_object, "edge_right");}

  for (var primitive_name in this.primitives)
  {
	this.primitives[primitive_name].node.onmouseup = function(event_object) {return that.onmouseup(event_object);}
	this.primitives[primitive_name].node.onmousemove = function(event_object) {return that.onmousemove(event_object);}

  }

										// the mouse can escape from under the red box and cause these
										/* notification when mouse moves over the wallpaper */
  this.wallpaper.attach_trigger(
	"onmousemove",
	function(event_object) {return that.onmousemove(event_object);});
										/* notification when mouse button goes up over the wallpaper */
  this.wallpaper.attach_trigger(
	"onmouseup",
	function(event_object) {return that.onmouseup(event_object);});

}

// -------------------------------------------------------------------------------
// establish the initial rectangle

dtack_drawing_rectangular_marquee_c.prototype.initialize = function(rectangle)
{
  var F = "show";
										/* remember the initial rectangle */
  this.initial_rectangle = rectangle;
										/* draw the marquee with the initial rectangle */
  this.show(rectangle);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.show = function(rectangle)
{
  var F = "show";

  this.primitives["interior"].attr({
	"x": rectangle.x0,
	"y": rectangle.y0,
	"width": rectangle.xe,
	"height": rectangle.ye,
	"stroke": "#FF0000",
	"fill": "#FF0000",
	"fill-opacity": "0.2"});

  this.primitives["edge_right"].attr({
	"x": rectangle.x0 + rectangle.xe - this.grab_handle_size,
	"y": rectangle.y0 + rectangle.ye * 0.2,
	"width": this.grab_handle_size,
	"height": rectangle.ye * 0.6,
	"stroke": "#FF0000",
	"fill": "#FF0000",
	"fill-opacity": "1.0"});

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.poke_keep_inside = function(region)
{
  var F = "poke_keep_inside";

  this.keep_inside_region = region;

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.onmousedown = function(event_object, primitive_name)
{
  var F = "onmousedown";

  if (this.inert)
  {
	return;
  }

  if (!event_object)
    event_object = window.event;

  this.mouse_x = dtack_utility_mouse_event_page_x(event_object);
  this.mouse_y = dtack_utility_mouse_event_page_y(event_object);

										/* reference the interior raphael object */
  var raphael_object = this.primitives[primitive_name];
										/* remember where the object was when the mouse first went down */
  this.mousedown_bbox = raphael_object.getBBox();

  var r = dtack_utility_relative_coordinates(event_object, this.canvas.raphael_div);

  this.grabbed_x = r.x - parseInt(this.mousedown_bbox.x.toFixed(0));
  this.grabbed_y = r.y - parseInt(this.mousedown_bbox.y.toFixed(0));

  this.debug(F,
    "mouse down" +
    " on " + primitive_name +
    " at " + this.mouse_x + ", " + this.mouse_y +
    " is relative to canvas " + r.x + ", " + r.y +
    " and relative to clicked object " + this.grabbed_x + ", " + this.grabbed_y);

  this.primitive_name_being_moved = primitive_name;

  return false;
} // end method

// -------------------------------------------------------------------------------
// mouseup might happen over this rectangular_marquee but is not specific to it
dtack_drawing_rectangular_marquee_c.prototype.onmouseup = function(event_object)
{
  var F = "onmouseup";

  if (this.inert)
  {
										/* forget the object we were dragging */
	this.primitive_name_being_moved = undefined;

    return;
  }

  if (this.primitive_name_being_moved != undefined)
  {
										/* reference the interior raphael object */
	var raphael_object = this.primitives[this.primitive_name_being_moved];

										/* remember where the object was when the mouse first went down */
	var mouseup_bbox = raphael_object.getBBox();

	if (mouseup_bbox.x != this.mousedown_bbox.x ||
	    mouseup_bbox.y != this.mousedown_bbox.y)
	{
										/* then notify all the triggers attached to the vertex */
										/* give them the vertex that was clicked, not us (the canvas) */
	  //vertex.pull_triggers("moved", vertex);

										/* let the vertex itself remember it moved */
	  //vertex.moved_while_mouse_down = true;
	}
										/* forget the object we were dragging */
	this.primitive_name_being_moved = undefined;
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.onmousemove = function(event_object)
{
  var F = "onmousemove";

  if (this.primitive_name_being_moved == undefined)
  {
    return;
  }

  if (this.inert)
  {
    return;
  }

  if (!event_object)
    event_object = window.event;

  this.mouse_x = dtack_utility_mouse_event_page_x(event_object);
  this.mouse_y = dtack_utility_mouse_event_page_y(event_object);

  //this.debug(F, "mouse moved in " + this.which_name(which));

  var r = dtack_utility_relative_coordinates(event_object, this.canvas.raphael_div);

  if (false)
  this.debug(F,
    "mouse move " +
    " at " + this.mouse_x + ", " + this.mouse_y +
    " is relative " + r.x + ", " + r.y);

										// get the upper left of the thing we are dragging
  var primitive_being_moved_x0 = r.x - this.grabbed_x;
  var primitive_being_moved_y0 = r.y - this.grabbed_y;

  var primitive_being_moved_bbox = this.primitives[this.primitive_name_being_moved].getBBox();

  var interior_bbox = this.primitives["interior"].getBBox();

  var new_rectangle = new dtack_drawing_region_c(
    this.dtack_environment,
	{
	  "x0": interior_bbox.x,
	  "y0": interior_bbox.y,
	  "xe": interior_bbox.width,
	  "ye": interior_bbox.height,
	  "debug_identifier": "redbox"
	});

  var doing;
										/* dragging the right hand edge? */
  if (this.primitive_name_being_moved == "edge_right")
  {
										/* increase the size of the interior */
	new_rectangle.xe = -interior_bbox.x + primitive_being_moved_x0 + this.grab_handle_size;

										/* make sure the aspect ratio stays the same */
										/* the aspect ratio typically is the aspect ratio of the viewport */
	new_rectangle.ye = new_rectangle.xe *
	  this.initial_rectangle.ye / this.initial_rectangle.xe;

	doing = "sizing";
  }
  else
										/* moving by dragging the interior? */
  if (this.primitive_name_being_moved == "interior")
  {
										/* in this case, there is no resizing */
	new_rectangle.x0 = primitive_being_moved_x0;
	new_rectangle.y0 = primitive_being_moved_y0;

	doing = "moving";
  }



										/* tell raphael to move interior where the object is displayed */
										/* make public the region covered by this marquee now */
										/* then notify all the triggers attached to us */
  this.poke_rectangle(new_rectangle, doing);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.poke_zoom_factor = function(zoom_factor)
{
  var F = "poke_zoom_factor";

  var interior_bbox = this.primitives["interior"].getBBox();

  var new_rectangle = new dtack_drawing_region_c(
    this.dtack_environment,
	{
	  "x0": interior_bbox.x,
	  "y0": interior_bbox.y,
	  "xe": this.initial_rectangle.xe / zoom_factor,
	  "ye": this.initial_rectangle.ye / zoom_factor,
	  "debug_identifier": "redbox"
	});

  var doing = "poking";
										/* tell raphael to move interior where the object is displayed */
										/* make public the region covered by this marquee now */
										/* then notify all the triggers attached to us */
  this.poke_rectangle(new_rectangle, doing);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_rectangular_marquee_c.prototype.poke_rectangle = function(new_rectangle, doing)
{
  var F = "poke_rectangle";

  var violation = null;

  if (this.keep_inside_region)
  {
	//new_rectangle.debug_identifier = "before";
	//new_rectangle.debug_dimensions(F);

	if (new_rectangle.x0 < this.keep_inside_region.x0)
	{
      new_rectangle.x0 = this.keep_inside_region.x0;
      violation = "left";
	}

	if (new_rectangle.y0 < this.keep_inside_region.y0)
	{
      new_rectangle.y0 = this.keep_inside_region.y0;
      violation = "top";
	}

	if (new_rectangle.x0 + new_rectangle.xe > this.keep_inside_region.x0 + this.keep_inside_region.xe)
	{
	  if (doing == "moving")
	  {
		new_rectangle.x0 = this.keep_inside_region.x0 + this.keep_inside_region.xe - new_rectangle.xe;
	  }

	  if (doing == "sizing")
	  {
		var new_xe = this.keep_inside_region.x0 + this.keep_inside_region.xe - new_rectangle.x0;
		new_rectangle.xe = new_xe;
		new_rectangle.ye = new_rectangle.xe * this.initial_rectangle.ye / this.initial_rectangle.xe;
		//this.debug(F, "new rectangle should be " + new_xe + " wide");
	  }

	  if (doing == "poking")
	  {
		var xs = (new_rectangle.x0 + new_rectangle.xe) - (this.keep_inside_region.x0 + this.keep_inside_region.xe);
		new_rectangle.x0 -= xs;
		if (new_rectangle.x0 < 0)
		  new_rectangle.x0 = 0;
		new_rectangle.xe = this.keep_inside_region.x0 + this.keep_inside_region.xe - new_rectangle.x0;
		new_rectangle.ye = new_rectangle.xe * this.initial_rectangle.ye / this.initial_rectangle.xe;
		//this.debug(F, "new rectangle should be " + new_xe + " wide");
	  }

      violation = "width";
	}

	if (new_rectangle.y0 + new_rectangle.ye > this.keep_inside_region.y0 + this.keep_inside_region.ye)
	{
	  if (doing == "moving")
	  {
		new_rectangle.y0 = this.keep_inside_region.y0 + this.keep_inside_region.ye - new_rectangle.ye;
	  }

	  if (doing == "sizing")
	  {
		new_rectangle.ye = this.keep_inside_region.y0 + this.keep_inside_region.ye - new_rectangle.y0;
		new_rectangle.xe = new_rectangle.ye / this.initial_rectangle.ye * this.initial_rectangle.xe;
	  }

	  if (doing == "poking")
	  {
		var ys = (new_rectangle.y0 + new_rectangle.ye) - (this.keep_inside_region.y0 + this.keep_inside_region.ye);
		new_rectangle.y0 -= ys;
		if (new_rectangle.y0 < 0)
		  new_rectangle.y0 = 0;
		new_rectangle.ye = this.keep_inside_region.y0 + this.keep_inside_region.ye - new_rectangle.y0;
		new_rectangle.ye = new_rectangle.ye * this.initial_rectangle.ye / this.initial_rectangle.ye;
		//this.debug(F, "new rectangle should be " + new_ye + " high");
	  }

      violation = "height";
	}
										/* trying to make it absolutely too small? */
	if (new_rectangle.xe < this.minimum_redbox_side_length)
	{
										// limit the smallest size the box can absolutely be
      new_rectangle.xe = this.minimum_redbox_side_length;
	  new_rectangle.ye = new_rectangle.xe * this.initial_rectangle.ye / this.initial_rectangle.xe;
      violation = "minimum absolute width";
	}
	if (new_rectangle.ye < this.minimum_redbox_side_length)
	{
      new_rectangle.ye = this.minimum_redbox_side_length;
	  new_rectangle.xe = new_rectangle.ye / this.initial_rectangle.ye * this.initial_rectangle.xe;
      violation = "minimum absolute height";
	}
										/* trying to make it too small relative to initial? */
	if (this.initial_rectangle.xe / new_rectangle.xe > this.minimum_redbox_side_ratio)
	{
										/* limit the maximum zoom factor we will deliver */
      new_rectangle.xe = this.initial_rectangle.xe / this.minimum_redbox_side_ratio;
	  new_rectangle.ye = new_rectangle.xe * this.initial_rectangle.ye / this.initial_rectangle.xe;
      violation = "minimum width ratio";
	}
	if (this.initial_rectangle.ye / new_rectangle.ye > this.minimum_redbox_side_ratio)
	{
      new_rectangle.ye = this.initial_rectangle.ye / this.minimum_redbox_side_ratio;
	  new_rectangle.xe = new_rectangle.ye / this.initial_rectangle.ye * this.initial_rectangle.xe;
      violation = "minimum height ratio";
	}
	//new_rectangle.debug_identifier = "after" + (violation? " (" + violation + " violation)": "");
	//new_rectangle.debug_dimensions(F);

  }

  if (violation)
  {
  }

										/* tell raphael to move interior where the object is displayed */
  this.show(new_rectangle);

										/* make public the region covered by this marquee now */
  this.public_region = new_rectangle;

										/* then notify all the triggers attached to us */
  this.pull_triggers("moving", this);


} // end method
