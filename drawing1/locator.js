
// --------------------------------------------------------------------
// class representing the xman entries grid

// wrap the prototyping in case the base class include files failed to arrive
try
{
										// inherit the base methods and variables
  dtack_drawing_locator_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
  dtack_drawing_locator_c.prototype.parent = dtack_base2_c;
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

function dtack_drawing_locator_c(page)
{
  var F = "dtack_drawing_locator_c";
										// initilialize the base instance variables
  this.construct(page.dtack_environment, F);

  this.page = page;
										/* make the drawing canvas */
  this.canvas = new dtack_drawing_canvas_c(this);

										/* currently active mode object */
  this.currently_active_mode_object = undefined;

  this.raphael = null;

  this.drawing_canvas_div = null;
  this.sheet_size = null;

  this.drawing_viewport_div = null;
  this.drawing_viewport_div_size = null;

  this.locator_canvas_div = null;
  this.locator_canvas_size = null;

  this.locator_viewport_div = null;

  this.wallpaper = null;
  this.rectangular_marquee = null;
										/* maximum zoom the locator will deliver */
  this.maximum_zoom = 4;
										/* publicly accessible zoom factor */
  this.public_zoom_factor = 1.0;

  this.public_pan_x = 0;
  this.public_pan_y = 0;
} // end constructor

// -------------------------------------------------------------------------------
dtack_drawing_locator_c.prototype.initialize = function(
  definition_data,
  drawing_canvas_div_id,
  drawing_viewport_div_id,
  locator_canvas_div_id,
  locator_viewport_div_id)
{
  var F = "initialize";

  if (definition_data != undefined)
  {
										/* location of the sheet we are marking up */
	var sheet_object = definition_data["mother"]["sheets"]["record"];
	
	this.drawing_canvas_div = dtack_environment.want_element(F, drawing_canvas_div_id);

										/* size of the sheet we are marking up */
	this.sheet_size = new dtack_drawing_region_c(
	  this.dtack_environment,
	  {
		"xe": parseFloat(sheet_object["xe"]),
		"ye": parseFloat(sheet_object["ye"]),
		"debug_identifier": "sheet"
	  });

	this.sheet_size.debug_dimensions(F);
										/* the dom element of the canvas div's containing div */
	this.drawing_viewport_div = dtack_environment.want_element(F, drawing_viewport_div_id);

										/* size of the viewport we are looking through */
	this.drawing_viewport_size =  new dtack_drawing_region_c(
	  this.dtack_environment,
	  {
		"xe": parseFloat(this.drawing_viewport_div.clientWidth),
		"ye": parseFloat(this.drawing_viewport_div.clientHeight),
		"debug_identifier": "drawing viewport"
	  });


	this.drawing_viewport_size.debug_dimensions(F);

										/* the div in which the locator raphael is drawing */
	this.locator_canvas_div = dtack_environment.want_element(F, locator_canvas_div_id);

	this.locator_canvas_size = new dtack_drawing_region_c(
	  this.dtack_environment,
	  {
		"xe": parseFloat(this.locator_canvas_div.clientWidth),
		"ye": parseFloat(this.locator_canvas_div.clientHeight),
		"debug_identifier": "locator canvas"
	  });

	this.locator_canvas_size.debug_dimensions(F);

										/* the div in which contains the locator canvas*/
	this.locator_viewport_div = dtack_environment.want_element(F, locator_viewport_div_id);

	var sheet_aspect_ratio = this.sheet_size.xe / this.sheet_size.ye;

	var border_size = new dtack_drawing_region_c(
	  this.dtack_environment,
	  {
		"xe": this.locator_canvas_div.offsetWidth - this.locator_canvas_div.clientWidth,
		"ye": this.locator_canvas_div.offsetHeight - this.locator_canvas_div.clientHeight,
		"debug_identifier": "locator canvas border"
	  });

	border_size.debug_dimensions(F);

	if (sheet_aspect_ratio < 1.0)
	{
	  this.locator_canvas_size.xe = Math.round(this.locator_canvas_size.xe * sheet_aspect_ratio);
	  this.locator_canvas_div.style.width = this.locator_canvas_size.xe + border_size.xe + "px";
	}
	if (sheet_aspect_ratio > 1.0)
	{
	  this.locator_canvas_size.ye = Math.round(this.locator_canvas_size.ye / sheet_aspect_ratio);
	  this.locator_canvas_div.style.height = this.locator_canvas_size.ye + border_size.ye + "px";
	}

	this.locator_canvas_size.debug_dimensions(F);

	//this.debug(F, "locator_canvas_div.offset size is now " + 
	//  this.locator_canvas_div.offsetWidth + "x" + this.locator_canvas_div.offsetHeight);
	//this.debug(F, "locator_canvas_div.client size is now " + 
	//  this.locator_canvas_div.clientWidth + "x" + this.locator_canvas_div.clientHeight);

										// create raphael canvas inside the locator_canvas_div
	this.raphael = Raphael(locator_canvas_div_id, this.locator_canvas_size.xe, this.locator_canvas_size.ye);

										/* initialize the canvas */
	this.canvas.debug_identifier = "locator";
	this.canvas.initialize(null);

										/* let the canvas know about raphael */
	this.canvas.use_raphael(
	  this.raphael, 0, 0);
										/* let the canvas know where the containing div is */
	this.canvas.raphael_div = this.locator_canvas_div;

										/* create raphael image covering the whole canvas */
	var wallpaper_raphael_object = this.raphael.image(
	  sheet_object["url"],
	  0, 
	  0, 
	  this.sheet_size.xe, 
	  this.sheet_size.ye);
										/* wrap a wallpaper object around the background image */
										// this makes it easier to catch events that happen to it
	this.wallpaper = new dtack_drawing_wallpaper_c(this, wallpaper_raphael_object);


	this.scale_sheet_to_locator = this.compute_scale(this.sheet_size, this.locator_canvas_size);

	this.debug(F, "sheet_to_locator " + this.scale_sheet_to_locator.debug);

	wallpaper_raphael_object.scale(
	  this.scale_sheet_to_locator.factor,
	  this.scale_sheet_to_locator.factor,
	  0, 0);

	this.rectangular_marquee = new dtack_drawing_rectangular_marquee_c(this.canvas, this.raphael, this.wallpaper);

										/* limit the maximum zoom factor we will deliver */
	this.rectangular_marquee.minimum_redbox_side_ratio = this.maximum_zoom;
	
	var xe = this.drawing_viewport_size.xe;
	if (xe > this.sheet_size.xe)
	  xe = this.sheet_size.xe;
	
	var ye = this.drawing_viewport_size.ye;
	if (ye > this.sheet_size.ye)
	  ye = this.sheet_size.ye;
	
										/* establish the initial rectangle */
	this.rectangular_marquee.initialize({
	  "x0": 0,
	  "y0": 0,
	  "xe": this.scale_sheet_to_locator.factor * xe,
	  "ye": this.scale_sheet_to_locator.factor * ye});

	this.rectangular_marquee.poke_keep_inside({
	  "x0": 0,
	  "y0": 0,
	  "xe": this.locator_canvas_size.xe,
	  "ye": this.locator_canvas_size.ye});
	  

	var that = this;


	//document.body.onmouseout = function(event_object) {that.debug_event("document.body.onmouseout", event_object);}
	//document.body.onmousemove = function(event_object) {that.debug_event("document.body.onmousemove", event_object);}

										// have a look at any mouseup happening anywhere over the document
	document.body.onmouseup = function(event_object) 
	{
	  if (!event_object) 
	    var event_object = window.event;

	  //that.debug_event("document.body.onmouseup", event_object);

										/* determine the element that had the mouseup happen to it */
	  var target = (window.event) ? event_object.srcElement : event_object.target;

										/* this mouseup is not within the locator viewport? */
	  if (!dtack_utility_ancestor_progeny(that.locator_canvas_div, target))
	  {
										/* tell the marquee to quit dragging/sizing */
		that.rectangular_marquee.onmouseup(event_object);
	  }
	}

										/* notification when marquee is moving */
	this.rectangular_marquee.attach_trigger(
	  "moving", 
	  function(rectangular_marquee) {return that.rectangular_marquee_moving(rectangular_marquee);});
  }
  else
  {
	this.debug(F, 
      "definition_data is undefined");
  }

} // end method

// -------------------------------------------------------------------------------
dtack_drawing_locator_c.prototype.rectangular_marquee_moving = function(rectangular_marquee)
{
  var F = "rectangular_marquee_moving";
	
	var xe = this.drawing_viewport_size.xe;
	if (xe > this.sheet_size.xe)
	  xe = this.sheet_size.xe;

										/* set the publicly accessible zoom factor */
  this.public_zoom_factor = 
    this.scale_sheet_to_locator.factor * xe /
    rectangular_marquee.public_region.xe;

										/* let everyone know we need to zoom */
										/* this will cause a scaling of the wallpaper */
										/* this will also cause translation of the vertices */
  this.pull_triggers("zooming", this);

										// movement origin in the canvas scale when panning while zoomed
  var canvas_x0 = rectangular_marquee.public_region.x0 * this.public_zoom_factor / 
    this.scale_sheet_to_locator.factor;
  var canvas_y0 = rectangular_marquee.public_region.y0 * this.public_zoom_factor / 
    this.scale_sheet_to_locator.factor;

  this.public_pan_x = Math.round(canvas_x0);
  this.public_pan_y = Math.round(canvas_y0);

										/* reposition the drawing canvas under the drawing viewport */
  this.drawing_canvas_div.style.left = "-" + this.public_pan_x + "px";
  this.drawing_canvas_div.style.top =  "-" + this.public_pan_y + "px";
  
  //this.debug(F, "this.scale_sheet_to_locator.factor is " + this.scale_sheet_to_locator.factor +
  //  " and this.public_zoom_factor is now " +  this.public_zoom_factor);
  
} // end method


// -------------------------------------------------------------------------------
dtack_drawing_locator_c.prototype.compute_scale = function(from_size, into_size)
{
  var F = "compute_scale";

  var factor = 1.0;
  var debug = "";
  var xfactor = into_size.xe / from_size.xe;
  var yfactor = into_size.ye / from_size.ye;

  if (xfactor < yfactor)
    factor = xfactor;
  else
    factor = yfactor;

  debug += 
    "scale factor converting " + 
    " from " + from_size.xe + "x" + from_size.ye +
	" into " + into_size.xe + "x" + into_size.ye +
    " is " + factor;

  return {
	"factor": factor,
	"debug": debug};

} // end method

