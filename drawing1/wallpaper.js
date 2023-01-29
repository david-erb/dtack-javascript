// --------------------------------------------------------------------
// class representing a drawing wallpaper

										// inherit the base methods and variables
dtack_drawing_wallpaper_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_drawing_wallpaper_c.prototype.constructor = dtack_drawing_wallpaper_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)
// if page has a canvas with the halo functions, they will get called
// otherwise, attach triggers to this object to get the events

function dtack_drawing_wallpaper_c(page, raphael_object, classname)
{
  var F = "dtack_drawing_wallpaper_c";

										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {

	this.parent = dtack_base2_c.prototype;
										/* call the base class constructor helper */
	this.parent.constructor.call(
	  this, 
	  page.dtack_environment, 
	  classname != undefined? classname: F);
  }

										/* remember the page who is housing us */
										// give null for page if it doesn't have the a canvas with the halo functions
										// in that case, attach triggers to this object to get the events
  this.page = page;
										/* remember the dom element which represents this wallpaper */
  this.raphael_object = raphael_object;

  this.definition_object = new Object;

  var that = this;

  //this.raphael_object.node.onclick = function(event_object) {return that.onclick(event_object);}

  //this.raphael_object.node.onmouseover = function(event_object) {return that.onmouseover(event_object);}
  //this.raphael_object.node.onmouseout = function(event_object) {return that.onmouseout(event_object);}

  this.raphael_object.node.onmousedown = function(event_object) {return that.onmousedown(event_object);}
  this.raphael_object.node.onmouseup = function(event_object) {return that.onmouseup(event_object);}

  this.raphael_object.node.onmousemove = function(event_object) {return that.onmousemove(event_object);}
}

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.onclick = function(event_object)
{
  var F = "onclick";

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.onmouseover = function(event_object)
{
  var F = "onmouseover";

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.onmouseout = function(event_object)
{
  var F = "onmouseout";

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.onmousedown = function(event_object)
{
  var F = "onmousedown";

 										/* the page has a mode going on? */
  if (this.page && this.page.currently_active_mode_object != undefined)
  {
										/* let the mode know that there was a mouse down */
										/* this will usually be to place an object */
	this.page.currently_active_mode_object.onmousedown(event_object);
  }
										/* let any attached triggers know about the mousedown */
										/* used by page to hide a comreq entry */
										// eztask #6728: clicking outside a locked note should unlock it
  this.pull_triggers("onmousedown", event_object);

  return false;
} // end method

// -------------------------------------------------------------------------------
// mouseup might happen over this wallpaper but is not specific to it
dtack_drawing_wallpaper_c.prototype.onmouseup = function(event_object)
{
  var F = "onmouseup";

  if (this.page && this.page.canvas && this.page.canvas.mouseup)
  {
	this.page.canvas.mouseup(this, event_object);
  }

										/* let any attached triggers know about the mouseup */
										/* important if mouse escapes from under a dragged object */
  this.pull_triggers("onmouseup", event_object);

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.onmousemove = function(event_object)
{
  var F = "onmousemove";

  if (this.page && this.page.canvas && this.page.canvas.halo_mousemove)
  {
	this.page.canvas.halo_mousemove(this, event_object);
  }

										/* let any attached triggers know about the mousemove */
										/* important if mouse escapes from under a dragged object */
  this.pull_triggers("onmousemove", event_object);

  return false;
} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.apply_definition_data = function(definition_data)
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
	//	this.debug(F, "not applying any wallpaper definitions because definition data is blank");
  }

} // end method

// -------------------------------------------------------------------------------

dtack_drawing_wallpaper_c.prototype.apply_definition_object = function(definition_object)
{
  var F = "apply_definition_object";

  for (var k in definition_object)
  {
	this.definition_object[k] = definition_object[k];

	this.debug(F, "applying " + k + " " + definition_object[k]);

	this.raphael_object.attr(k, definition_object[k]);
  }

} // end method
